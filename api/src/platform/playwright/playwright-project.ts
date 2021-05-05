import { playwrightLauncher } from './playwright-launcher';
import { Plugin } from '../plugin';
import { Project } from '../project';
import { Suite } from '../../sdk/suite';
import { afterFeature } from '../../plugins/after-feature';
import { execute } from '../../plugins/execute';
import { afterScenario } from '../../plugins/after-scenario';
import { afterStep } from '../../plugins/after-step';
import { beforeFeature } from '../../plugins/before-feature';
import { beforeScenario } from '../../plugins/before-scenario';
import { beforeStep } from '../../plugins/before-step';
import {step} from '../../plugins/step';

export class PlaywrightProject implements Project {
  constructor(private suite: Suite) {
  }

  run(...plugins: Plugin[]): Promise<void> {
    return playwrightLauncher(this.suite, [
      ...plugins,
      afterFeature(execute),
      afterScenario(execute),
      afterStep(execute),
      beforeFeature(execute),
      beforeScenario(execute),
      beforeStep(execute),
      step(execute),
    ]);
  }
}