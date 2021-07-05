import { Data, errors, Guard, isObject, reinterpret } from '@skintest/common';
import { Browser, Command, fail, pass, RepeatEntry, Scenario, Script, StepExecutionResult, Suite, Value, VALUE_REF } from '@skintest/sdk';
import { Attempt } from './attempt';
import { CommandScope, Datum, Staging, Step } from './stage';

function noScenario(): Scenario {
  return {
    name: '',
    commands: [],
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

    const [ok] = await this.plan(
      'feature:before',
      script,
      noScenario(),
      toSteps(script.beforeFeature)
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

    await this.plan(
      'feature:after',
      script,
      noScenario(),
      toSteps(script.afterFeature)
    );
  }

  private async scenario(
    script: Script,
    scenario: Scenario
  ): Promise<void> {

    const beforeScenarioEffect = this.effect('scenario:before');
    const afterScenarioEffect = this.effect('scenario:after');
    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
      scenario,
    };

    await beforeScenarioEffect(scope);

    const [ok] = await this.plan(
      'scenario:before',
      script,
      scenario,
      toSteps(script.beforeScenario)
    );

    if (ok) {
      const { attributes } = scenario;
      const data = attributes.data ?? [undefined];
      for (let i = 0; i < data.length; i++) {
        const datum: Datum = [i, data[i]];
        await this.steps(script, scenario, datum);
      }
    }

    await afterScenarioEffect(scope);

    await this.plan(
      'scenario:after',
      script,
      scenario,
      toSteps(script.afterScenario)
    );
  }

  private async steps(
    script: Script,
    scenario: Scenario,
    datum: Datum,
  ): Promise<boolean> {

    const beforeStepEffect = this.effect('step:before');
    const afterStepEffect = this.effect('step:after');
    const { commands: steps } = scenario;

    for (let i = 0; i < steps.length; i++) {
      const step: Step = [i, steps[i]];

      const scope = {
        suite: this.suite,
        browser: this.browser,
        script,
        scenario,
        step,
        datum
      };

      await beforeStepEffect(scope);

      let [ok] = await this.plan(
        'step:before',
        script,
        scenario,
        toSteps(script.beforeStep)
      );

      if (ok) {
        [ok] = await this.plan(
          'step',
          script,
          scenario,
          [step],
          [],
          datum
        );
      }

      await afterStepEffect(scope);

      ok = (await this.plan(
        'step:after',
        script,
        scenario,
        script.afterStep.map((x, i) => [i, x])
      ))[0] && ok;

      if (!ok) {
        return false;
      }
    }

    return true;
  }

  private async plan(
    site: CommandScope['site'],
    script: Script,
    scenario: Scenario,
    steps: Step[],
    path: Array<StepExecutionResult['type']> = [],
    datum: Datum = [0, undefined],
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
        const materialize = (value: Value<any, Data>): any => {
          if (isObject(value) && VALUE_REF in value) {
            const [_, data] = datum;
            Guard.notNull(data, 'data');

            const key = value[VALUE_REF];
            return data?.[key];
          }

          return value;
        };

        const run = await attempt.step(() => {
          const [_, command] = step;
          return command.execute({ browser, materialize });
        });

        const runPlan =
          (commands: Command[]) =>
            this.plan(
              site,
              script,
              scenario,
              toSteps(commands),
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

            const host = path[path.length - 1];
            const controlFlow = host === 'condition' || host === 'repeat';
            if (result.effect === 'break' || controlFlow) {
              errorSink.push(result.description);
              breakLoop = true;
            }

            if (controlFlow) {
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

function toSteps(commands: ReadonlyArray<Command> | Command[]): Step[] {
  return commands.map((cmd, i) => [i, cmd]);
}