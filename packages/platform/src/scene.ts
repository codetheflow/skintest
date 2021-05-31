import { Browser, Command, pass, Script, Suite } from '@skintest/sdk';
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
      depth: 0,
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
    depth = 0,
  ): Promise<boolean> {

    const { browser, attempt } = this;

    const stepEffect = this.effect('step');
    const passEffect = this.effect('step:pass');
    const failEffect = this.effect('step:fail');

    const scope = {
      suite: this.suite,
      browser,
      site,
      script,
      scenario,
      depth,
    };

    let result = true;
    for (const step of steps) {
      await stepEffect({ ...scope, step });

      try {
        const test = await attempt.step(() => step.execute({ browser }));
        if (test.result.status === 'pass') {
          await passEffect({ ...scope, step, result: pass() });
        } else {
          result = false;
          await failEffect({ ...scope, step, reason: test.result });
          if (test.result.loop === 'break') {
            break;
          }
        }

        const results = await Promise.all(
          test
            .plans
            .map(plan => this.runPlan(
              site,
              script,
              scenario,
              plan,
              depth + 1
            ))
        );

        result = result && !results.includes(false);
      } catch (ex) {
        await failEffect({ ...scope, step, reason: ex });
        result = false;
        break;
      }
    }

    return result;
  }
}