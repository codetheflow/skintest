import { errors } from '@skintest/common';
import * as glob from 'glob';
import * as path from 'path';
import { Plugin } from './plugin';
import { OnStage } from './stage';

export function nodeFeatureExplorer(): Plugin {
  return (stage: OnStage) => stage({
    'start': async ({ suite }) => {
      // todo: add reporting?
      const cwd = path.join(suite.uri, 'features');
      const files = glob.sync('*.js', { cwd });
      for (const file of files) {
        const feature = path.join(cwd, file);

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