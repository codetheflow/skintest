import { playwrightLauncher } from './playwright-launcher';
import { Project } from './project';
import { Suite } from '../integration/suite';
import * as glob from 'glob';
import * as path from 'path';

export class NodeProject implements Project {
  constructor(private suite: Suite) {
  }

  addFeaturesFrom(dir: string): Promise<void> {
    // TODO: do we need to make it real async?
    // TODO: reporting
    const files = glob.sync('*.js', { cwd: dir });
    console.log(`found ${files.length} feature file(s)`);
    for (let file of files) {
      const feature = path.join(dir, file);
      // console.log(`add feature: ${feature}`);

      try {
        require(feature);
      } catch (ex) {
        console.log(ex);
      }
    }

    return Promise.resolve();
  }

  run(): Promise<void> {
    return playwrightLauncher(this.suite);
  }
}