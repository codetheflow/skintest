import { playwrightLauncher } from './playwright-launcher';
import { Plugin } from '../plugin';
import { Project } from '../project';
import { Suite } from '../../sdk/suite';
import { afterFeature } from '../../plugins/after-feature';
import { plan } from '../../plugins/plan';
import { afterScenario } from '../../plugins/after-scenario';
import { afterStep } from '../../plugins/after-step';
import { beforeFeature } from '../../plugins/before-feature';
import { beforeScenario } from '../../plugins/before-scenario';
import { beforeStep } from '../../plugins/before-step';
import { step } from '../../plugins/step';

export class PlaywrightProject implements Project {
  constructor(private suite: Suite) {
  }

  run(...plugins: Plugin[]): Promise<void> {
    return playwrightLauncher(this.suite, [
      ...plugins,
      afterFeature(plan),
      afterScenario(plan),
      afterStep(plan),
      beforeFeature(plan),
      beforeScenario(plan),
      beforeStep(plan),
      step(plan),
    ]);
  }
}