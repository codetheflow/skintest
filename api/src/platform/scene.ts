import { Browser } from '../sdk/browser';
import { Command } from '../sdk/command';
import { Script } from '../sdk/script';
import { FeatureScope, ScenarioScope, StageExecutionResult, Staging, StepScope } from './stage';

export class Scene {
  constructor(
    private effect: Staging,
    private browser: Browser,
  ) {
  }

  play(script: Script): Promise<void> {
    const { browser } = this;
    return this.feature({ script, browser });
  }

  private async feature(scope: FeatureScope): Promise<void> {
    const beforeFeature = this.effect('before.feature');
    const afterFeature = this.effect('after.feature');

    const result = await beforeFeature(scope);
    if (result.effect === 'continue') {
      for (let [scenario, steps] of scope.script.scenarios) {
        await this.scenario({ ...scope, scenario }, steps);
      }
    }

    await afterFeature(scope);
  }

  private async scenario(scope: ScenarioScope, steps: Command[]): Promise<void> {
    const beforeScenario = this.effect('before.scenario');
    const afterScenario = this.effect('after.scenario');

    const result = await beforeScenario(scope);
    if (result.effect === 'continue') {
      for (let step of steps) {
        const ok = await this.step({ ...scope, step });
        if (!ok) {
          break;
        }
      }
    }

    await afterScenario(scope);
  }

  private async step(scope: StepScope): Promise<boolean> {
    const beforeStep = this.effect('before.step');
    const afterStep = this.effect('after.step');
    const step = this.effect('step');
    const isOkay = (result: StageExecutionResult) => result.effect === 'continue';

    let ok = isOkay(await beforeStep(scope));
    if (ok) {
      ok = isOkay(await step(scope));
    }

    ok = isOkay(await afterStep(scope)) && ok;
    return ok;
  }
}
