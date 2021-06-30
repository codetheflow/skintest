import { errors } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { RuntimeScript } from '@skintest/sdk';
import * as glob from 'glob';
import * as path from 'path';
import { stdout } from 'process';
import { tty } from './tty';

export function nodeFeatureExplorer(patterns: string[] = ['*.js']): Plugin {
  tty.test(stdout);

  return (stage: OnStage) => stage({
    'project:mount': async ({ suite }) => {
      const cwd = path.join(suite.uri, 'features');

      const files: string[] = [];
      patterns.forEach(x => files.push(...glob.sync(x, { cwd })));

      tty.newLine(stdout, tty.h1(`probe ${files.length} feature(s)`));
      for (const file of files) {
        const featurePath = path.join(cwd, file);
        const countAtStart = suite.getScripts().length;
        try {
          require(featurePath);
          tty.newLine(stdout, tty.h2(featurePath));
        } catch (ex) {
          tty.newLine(stdout, tty.h2(featurePath), ' - ', tty.warn('skipped'));
          await tty.writeError(stdout, ex);
          continue;
        }
        const countAtEnt = suite.getScripts().length;

        const diff = countAtEnt - countAtStart;
        if (diff !== 1) {
          throw errors.constraint(`${featurePath} expected 1 feature per file, got ${diff}`);
        }

        const features = suite.getScripts();
        const feature = features[features.length - 1] as RuntimeScript;
        feature.name = path.parse(featurePath).name;
      }
    }
  });
}