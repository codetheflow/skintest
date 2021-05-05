
import { EMPTY } from '../common/utils';
import { Script } from '../sdk/script';
import { Staging } from './plugin';

export class Scene {
  constructor(
    private effect: Staging
  ) {
  }

  async play(script: Script): Promise<void> {
    const beforeFeature = this.effect('before.feature', script);
    const afterFeature = this.effect('after.feature', script);
    const beforeScenario = this.effect('before.scenario', script);
    const afterScenario = this.effect('after.scenario', script);
    const beforeStep = this.effect('before.step', script);
    const afterStep = this.effect('after.step', script);
    const step = this.effect('step', script);

    // TODO: improve readability
    if ((await beforeFeature(EMPTY)).effect !== 'break') {
      for (let [scenario, commands] of script.scenarios) {
        if ((await beforeScenario({ scenario })).effect !== 'break') {
          for (let command of commands) {

            let result = false;
            if ((await beforeStep({ scenario, command })).effect !== 'break') {
              result = (await step({ scenario, command })).effect !== 'break';
            }
            result = (await afterStep({ scenario, command })).effect !== 'break' && result;

            if (!result && command.type !== 'assert') {
              break;
            }
          }
        }

        await afterScenario({ scenario });
      }
    }

    await afterFeature(EMPTY);
  }
}