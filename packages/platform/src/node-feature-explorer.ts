import { errors } from '@skintest/common';
import { RuntimeScript } from '@skintest/sdk';
import * as glob from 'glob';
import * as path from 'path';
import { Plugin } from './plugin';
import { OnStage } from './stage';

export function nodeFeatureExplorer(): Plugin {
  return (stage: OnStage) => stage({
    'project:mount': async ({ suite }) => {
      // todo: add reporting?
      const cwd = path.join(suite.uri, 'features');
      const files = glob.sync('*.js', { cwd });
      for (const file of files) {
        const featurePath = path.join(cwd, file);

        const countAtStart = suite.getScripts().length;
        require(featurePath);
        const countAtEnt = suite.getScripts().length;

        const diff = countAtEnt - countAtStart;
        if (diff !== 1) {
          throw errors.constraint(`${featurePath} expected 1 feature per file, got ${diff}`);
        }

        const features =  suite.getScripts();
        const feature = features[features.length - 1] as RuntimeScript;
        feature.name =  path.parse(featurePath).name;
      }
    }
  });
}