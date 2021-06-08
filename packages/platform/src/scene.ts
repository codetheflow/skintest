import { errors, reinterpret } from '@skintest/common';
import { Browser, Command, pass, Script, StepExecutionResult, Suite } from '@skintest/sdk';
import { Attempt } from './attempt';
import { CommandScope, Staging } from './stage';

const NO_SCENARIO = '';

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

    const ok = await this.runPlan(
      'feature:before',
      script,
      NO_SCENARIO,
      script.beforeFeature
    );

    if (ok) {
      const { operations } = this.suite;

      const scenarios = script
        .scenarios
        .filter(([name]) => operations.filterScenario(script.name, name));

      for (const [scenario, steps] of scenarios) {
        await this.scenario(script, scenario, steps);
      }
    }

    await afterFeatureEffect(scope);

    await this.runPlan(
      'feature:after',
      script,
      NO_SCENARIO,
      script.afterFeature
    );
  }

  private async scenario(
    script: Script,
    scenario: string,
    steps: ReadonlyArray<Command>,
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

    const ok = await this.runPlan(
      'scenario:before',
      script,
      scenario,
      script.beforeScenario
    );

    if (ok) {
      for (const step of steps) {
        const result = await this.step(script, scenario, step);
        if (!result) {
          break;
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
    scenario: string,
    step: Command,
  ): Promise<boolean> {

    const beforeStepEffect = this.effect('step:before');
    const afterStepEffect = this.effect('step:after');

    const scope = {
      suite: this.suite,
      browser: this.browser,
      script,
      scenario,
      step,
    };

    await beforeStepEffect(scope);

    let ok = await this.runPlan(
      'step:before',
      script,
      scenario,
      script.beforeStep
    );

    if (ok) {
      ok = await this.runPlan(
        'step',
        script,
        scenario,
        [step]
      );
    }

    await afterStepEffect(scope);

    ok = await this.runPlan(
      'step:after',
      script,
      scenario,
      script.afterStep
    ) && ok;

    return ok;
  }

  private async runPlan(
    site: CommandScope['site'],
    script: Script,
    scenario: string,
    steps: ReadonlyArray<Command>,
    path: Array<StepExecutionResult['type']> = []
  ): Promise<boolean> {

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
    };

    let breakLoop = false;
    const fails: string[] = [];

    for (const step of steps) {
      if (breakLoop) {
        break;
      }

      await stepEffect({ ...scope, step, path });

      try {
        const run = await attempt.step(() => step.execute({ browser }));

        const runPlan =
          (commands: Command[]) =>
            this.runPlan(
              site,
              script,
              scenario,
              commands,
              path.concat(run.type)
            );

        switch (run.type) {
          case 'method': {
            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'assert': {
            const { result } = run;

            if (result.status === 'fail') {
              const host = path[path.length - 1];
              breakLoop = host === 'condition' || host === 'repeat';

              fails.push(result.description);
              await failEffect({ ...scope, step, reason: result, path });
            } else {
              await passEffect({ ...scope, step, result, path });
            }

            break;
          }
          case 'inspect': {
            await inspectEffect({ ...scope, step, inspect: run.info, path });
            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'perform':
          case 'recipe': {
            await runPlan(run.plan);
            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'condition': {
            await runPlan(run.plan);
            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'repeat': {
            // todo: add timeout exception or warning if loop runs too long
            let next = true;
            while (next) {
              next = await runPlan(run.plan);
            }

            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          case 'wait': {
            await Promise.all([
              runPlan([run.waiter]),
              runPlan(run.trigger),
            ]);

            await passEffect({ ...scope, step, result: pass(), path });
            break;
          }
          default: {
            throw errors.invalidArgument('type', reinterpret<StepExecutionResult>(run).type);
          }
        }
      } catch (ex) {
        await failEffect({ ...scope, step, reason: ex, path: path });
        fails.push(ex.message);
        break;
      }
    }

    return fails.length === 0;
  }
}