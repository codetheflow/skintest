import { Browser } from '../sdk/browser';
import { Script } from '../sdk/script';
import { FeatureScope, ScenarioScope, Staging, StepScope } from './plugin';

export class Scene {
  constructor(
    private effect: Staging,
    private browser: Browser,
  ) {
  }

  async play(script: Script): Promise<void> {
    const beforeFeature = this.effect('before.feature');
    const afterFeature = this.effect('after.feature');
    const beforeScenario = this.effect('before.scenario');
    const afterScenario = this.effect('after.scenario');
    const beforeStep = this.effect('before.step');
    const afterStep = this.effect('after.step');
    const onStep = this.effect('step');

    // todo: improve readability
    const featureScope: FeatureScope = { script, browser: this.browser };
    if ((await beforeFeature(featureScope)).effect !== 'break') {
      for (let [scenario, steps] of script.scenarios) {
        const scenarioScope: ScenarioScope = { ...featureScope, scenario };
        if ((await beforeScenario(scenarioScope)).effect !== 'break') {
          for (let step of steps) {
            const stepScope: StepScope = { ...scenarioScope, step };

            let result = false;
            if ((await beforeStep(stepScope)).effect !== 'break') {
              result = (await onStep(stepScope)).effect !== 'break';
            }
            result = (await afterStep(stepScope)).effect !== 'break' && result;

            if (!result && step.type !== 'assert') {
              break;
            }
          }
        }

        await afterScenario(scenarioScope);
      }
    }

    await afterFeature(featureScope);
  }
}