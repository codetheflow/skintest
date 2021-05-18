import * as glob from 'glob';
import * as path from 'path';
import { Plugin } from '../platform/plugin';
import { OnStage } from '../platform/stage';

type ExploreFeatures = {
  dir: string;
}

export function exploreFeatures(options: ExploreFeatures): Plugin {
  const { dir } = options;

  return (stage: OnStage) => stage({
    'start': async () => {
      // todo: do we need to make it real async?
      // todo: reporting
      const files = glob.sync('*.js', { cwd: dir });
      console.log(`found ${files.length} feature file(s)`);
      for (let file of files) {
        const feature = path.join(dir, file);
        console.log(`explore: ${feature}`);

        require(feature);
      }
    }
  });
}