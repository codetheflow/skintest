import { OnStage, Plugin } from '@skintest/platform';
import * as glob from 'glob';
import * as path from 'path';

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
      for (const file of files) {
        const feature = path.join(dir, file);
        require(feature);
      }
    }
  });
}