import { Browser, ClientFunction, Command, DoStep, PageClient, Process, Script, ServerFunction, Suite } from '@skintest/sdk';
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
    const beforeFeatureEffect = this.effect('before.feature');
    const afterFeatureEffect = this.effect('after.feature');

    const scope = {
      suite: this.suite,
      script,
    };

    await beforeFeatureEffect(scope);

    const ok = await this.runPlan(
      'before.feature',
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
      'after.feature',
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

    const beforeScenarioEffect = this.effect('before.scenario');
    const afterScenarioEffect = this.effect('after.scenario');

    const scope = {
      suite: this.suite,
      script,
      scenario,
    };

    await beforeScenarioEffect(scope);

    const ok = await this.runPlan(
      'before.scenario',
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
      'after.scenario',
      script,
      scenario,
      script.afterScenario
    );
  }

  private async step(
    script: Script,
    scenario: string,
    step: Command
  ): Promise<boolean> {

    const beforeStepEffect = this.effect('before.step');
    const afterStepEffect = this.effect('after.step');

    const scope = {
      suite: this.suite,
      script,
      scenario,
      step,
    };

    await beforeStepEffect(scope);

    let ok = await this.runPlan(
      'before.step',
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
      'after.step',
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
    steps: ReadonlyArray<Command>
  ): Promise<boolean> {

    const { browser, attempt } = this;

    const stepEffect = this.effect('step');
    const passEffect = this.effect('step.pass');
    const failEffect = this.effect('step.fail');

    const scope = {
      suite: this.suite,
      site,
      script,
      scenario,
    };

    let result = true;
    for (const step of steps) {
      await stepEffect({ ...scope, step });

      try {
        if (step.type === 'do') {
          const recipeOk = await this.runRecipe(
            site,
            script,
            scenario,
            step
          );

          if (!recipeOk) {
            result = false;
            break;
          }
        } else {
          const test = await attempt.step(() => step.execute({ browser }));
          if (test.status === 'fail') {
            await failEffect({ ...scope, step, reason: test });
            if (step.type !== 'assert') {
              result = false;
              break;
            }
          } else {
            await passEffect({ ...scope, step, result: test });
          }
        }
      } catch (ex) {
        await failEffect({ ...scope, step, reason: ex });
        result = false;
      }
    }

    return result;
  }

  private async runRecipe(
    site: CommandScope['site'],
    script: Script,
    scenario: string,
    step: DoStep
  ): Promise<boolean> {

    const { browser, attempt } = this;

    const scope = {
      suite: this.suite,
      site,
      script,
      scenario,
      step,
    };

    const recipeEffect = this.effect('recipe');
    const recipePassEffect = this.effect('recipe.pass');
    const recipeFailEffect = this.effect('recipe.fail');

    await recipeEffect(scope);

    if (step.recipe.type === 'server') {
      const server = new Process();
      const action = step.recipe.action as ServerFunction;
      try {
        const { message } = await attempt.action(() => action.apply(server, step.args));
        await recipePassEffect({
          ...scope,
          message
        });

        return true;
      } catch (ex) {
        await recipeFailEffect({
          ...scope,
          reason: ex
        });

        return false;
      }
    }

    const page = browser.getCurrentPage();
    const client = new PageClient(page);
    const action = step.recipe.action as ClientFunction;

    try {
      const { message, plan } = await attempt.action(() => action.call(client, step.args));
      await recipePassEffect({
        ...scope,
        message
      });

      return await this.runPlan(
        'recipe',
        script,
        scenario,
        plan
      );
    } catch (ex) {
      await recipeFailEffect({
        ...scope,
        reason: ex
      });

      return false;
    }
  }
}