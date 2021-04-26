import { Suite } from '../integration/suite';
import { playwrightLauncher } from './playwright-launcher';
import * as glob from 'glob';
import * as path from 'path';

export interface Project {
  addFeaturesFrom(path: string): Promise<void>;
  run(): Promise<void>;
}

export class LocalProject implements Project {
  constructor(private suite: Suite) {
  }

  addFeaturesFrom(dir: string): Promise<void> {
    //TODO: do we need to make it real async?
    const files = glob.sync('*.js', { cwd: dir });
    console.log(`found ${files.length} features`);
    for (let file of files) {
      const feature = path.join(dir, file);
      console.log(`add feature: ${feature}`);

      require(feature);
    }

    return Promise.resolve();
  }

  run(): Promise<void> {
    return playwrightLauncher(this.suite);
  }
}