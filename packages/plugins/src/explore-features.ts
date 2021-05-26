import { errors } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import * as glob from 'glob';
import * as path from 'path';

type ExploreFeatures = {
  dir: string;
}

export function exploreFeatures(options: ExploreFeatures): Plugin {
  const { dir } = options;

  return (stage: OnStage) => stage({
    'start': async ({ suite }) => {
      // todo: do we need to make it real async?
      // todo: reporting
      const files = glob.sync('*.js', { cwd: dir });
      for (const file of files) {
        const feature = path.join(dir, file);

        const countAtStart = suite.getScripts().length;
        require(feature);
        const countAtEnt = suite.getScripts().length;

        const diff = countAtEnt - countAtStart;
        if (diff > 1) {
          throw errors.constraint(`${feature} expected 1 feature per file, got ${diff}`);
        }
      }
    }
  });
}