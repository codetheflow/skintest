import { errors, Guard, isObject, reinterpret, Serializable } from '@skintest/common';
import { Browser, Command, fail, pass, RepeatEntry, Scenario, Script, StepExecutionResult, Suite, Value, VALUE_KEY } from '@skintest/sdk';
import { Attempt } from './attempt';
import { CommandScope, Staging } from './stage';

function noScenario(): Scenario {
  return {
    name: '',
    steps: [],
    attributes: {}
  };
}

export class Scene {
  constructor(
    private suite: Suite,
    private effect: Staging,
    private browser: Browser,
    private attempt: Attempt,
  ) {
  }

  play(script: Script): Promise<void> {
    return this.feature(script);
  }

  private async feature(script: Script): Promise<void> {
    const beforeFeatureEffect = this.effect('feature:before');
    const afterFeatureEffect = this.effect('feature:after');

    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
    };

    await beforeFeatureEffect(scope);

    const [ok] = await this.runPlan(
      'feature:before',
      script,
      noScenario(),
      script.beforeFeature
    );

    if (ok) {
      const { operations } = this.suite;

      const scenarios = script
        .scenarios
        .filter(scenario =>
          operations
            .filterScenario(script.name, scenario)
        );

      for (const scenario of scenarios) {
        await this.scenario(script, scenario);
      }
    }

    await afterFeatureEffect(scope);

    await this.runPlan(
      'feature:after',
      script,
      noScenario(),
      script.afterFeature
    );
  }

  private async scenario(
    script: Script,
    scenario: Scenario
  ): Promise<void> {

    const beforeScenarioEffect = this.effect('scenario:before');
    const afterScenarioEffect = this.effect('scenario:after');
    const dataScenarioEffect = this.effect('scenario:data');

    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
      scenario,
    };

    await beforeScenarioEffect(scope);

    const [ok] = await this.runPlan(
      'scenario:before',
      script,
      scenario,
      script.beforeScenario
    );

    if (ok) {
      const { steps, attributes } = scenario;
      for (const datum of (attributes.data ?? [null])) {
        await dataScenarioEffect({ ...scope, datum });

        for (const step of steps) {
          const result = await this.step(script, scenario, step, datum);
          if (!result) {
            break;
          }
        }
      }
    }

    await afterScenarioEffect(scope);

    await this.runPlan(
      'scenario:after',
      script,
      scenario,
      script.afterScenario
    );
  }

  private async step(
    script: Script,
    scenario: Scenario,
    step: Command,
    datum: Serializable | null = null
  ): Promise<boolean> {

    const beforeStepEffect = this.effect('step:before');
    const afterStepEffect = this.effect('step:after');

    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
      scenario,
      step,
      datum
    };

    await beforeStepEffect(scope);

    let [ok] = await this.runPlan(
      'step:before',
      script,
      scenario,
      script.beforeStep
    );

    if (ok) {
      [ok] = await this.runPlan(
        'step',
        script,
        scenario,
        [step],
        [],
        datum
      );
    }

    await afterStepEffect(scope);

    ok = (await this.runPlan(
      'step:after',
      script,
      scenario,
      script.afterStep
    ))[0] && ok;

    return ok;
  }

  private async runPlan(
    site: CommandScope['site'],
    script: Script,
    scenario: Scenario,
    steps: ReadonlyArray<Command>,
    path: Array<StepExecutionResult['type']> = [],
    datum: Serializable | null = null,
  ): Promise<[boolean, string[]]> {

    const { browser, attempt } = this;

    const stepEffect = this.effect('step');
    const passEffect = this.effect('step:pass');
    const failEffect = this.effect('step:fail');
    const inspectEffect = this.effect('step:inspect');

    const scope = {
      suite: this.suite,
      browser,
      site,
      script,
      scenario,
      datum
    };

    let breakLoop = false;
    const errorSink: string[] = [];

    for (const step of steps) {
      if (breakLoop) {
        break;
      }

      await stepEffect({ ...scope, step, path });

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const materialize = (value: Value<any, Serializable>): any => {
          if (isObject(value) && VALUE_KEY in value) {
            Guard.notNull(datum, 'datum');

            const key = value[VALUE_KEY];
            return datum?.[key];
          }

          return value;
        };

        const run = await attempt.step(() => step.execute({ browser, materialize }));

        const runPlan =
          (commands: Command[]) =>
            this.runPlan(
              site,
              script,
              scenario,
              commands,
              path.concat(run.type),
              datum
            );

        switch (run.type) {
          case 'method': {
            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'assert': {
            const { result } = run;
            if (result.status === 'pass') {
              await passEffect({ ...scope, step, result, path });
              break;
            }

            errorSink.push(result.description);

            const host = path[path.length - 1];
            const asPredicate = host === 'condition' || host === 'repeat';
            if (asPredicate) {
              breakLoop = true;
              await passEffect({ ...scope, step, result: pass(), path });
              break;
            }

            await failEffect({ ...scope, step, reason: result, path });
            break;
          }
          case 'inspect': {
            await inspectEffect({ ...scope, step, inspect: run.info, path });
            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'recipe':
          case 'perform': {
            const [ok, innerErrors] = await runPlan(run.plan);
            if (ok) {
              await passEffect({ ...scope, step, result: pass(), path });
              break;
            }

            const error = {
              description: innerErrors.join('\n'),
              solution: 'debug'
            };

            breakLoop = true;
            errorSink.push(...innerErrors);
            await failEffect({ ...scope, step, reason: fail.reason(error), path });
            break;
          }
          case 'condition': {
            const [yes] = await runPlan(run.cause);
            if (!yes) {
              await passEffect({ ...scope, step, result: pass(), path });
              break;
            }

            const [ok, innerErrors] = await runPlan(run.plan);
            if (ok) {
              await passEffect({ ...scope, step, result: pass(), path });
            } else {
              const error = {
                description: innerErrors.join('\n'),
                solution: 'debug'
              };

              breakLoop = true;
              errorSink.push(...innerErrors);
              await failEffect({ ...scope, step, reason: fail.reason(error), path });
            }

            break;
          }
          case 'repeat': {
            // todo: add timeout exception or warning if loop runs too long
            let index = 0;
            let odd = false;
            let even = true;
            let first = true;

            do {
              const entry: RepeatEntry = { first, index, odd, even, };

              first = false;
              index++;
              odd = !odd;
              even = !even;

              run.writes.forEach(x => x.next(entry));

              const [next] = await runPlan(run.till);
              if (!next) {
                break;
              }

              const [ok, innerErrors] = await runPlan(run.plan);
              if (!ok) {
                const error = {
                  description: innerErrors.join('\n'),
                  solution: 'debug'
                };

                breakLoop = true;
                errorSink.push(...innerErrors);
                await failEffect({ ...scope, step, reason: fail.reason(error), path });
                break;
              }
              // eslint-disable-next-line no-constant-condition
            } while (true);

            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'event': {
            const [handlerOk, triggerOk] = await Promise.all([
              runPlan([run.handler]),
              runPlan(run.trigger),
            ]);

            breakLoop = !(handlerOk[0] && triggerOk[0]);
            if (breakLoop) {
              const innerErrors: string[] = [];
              if (!handlerOk[0]) {
                innerErrors.push(...handlerOk[1]);
              }

              if (!triggerOk[0]) {
                innerErrors.push(...triggerOk[1]);
              }

              breakLoop = true;
              errorSink.push(...innerErrors);

              const error = {
                description: innerErrors.join('\n'),
                solution: 'debug'
              };

              await failEffect({ ...scope, step, reason: fail.reason(error), path });
            } else {
              await passEffect({ ...scope, step, result: pass(), path });
            }
            break;
          }
          default: {
            throw errors.invalidArgument('type', reinterpret<StepExecutionResult>(run).type);
          }
        }
      } catch (ex) {
        await failEffect({ ...scope, step, reason: ex, path });
        errorSink.push(ex.message);
        break;
      }
    }

    return [errorSink.length === 0, errorSink];
  }
}