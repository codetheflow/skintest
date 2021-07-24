import { errors, qte, Transaction, TransactionSink } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { RuntimeScript, Suite } from '@skintest/sdk';
import * as glob from 'glob';
import * as path from 'path';
import { stdout } from 'process';
import { tty } from './tty';

export function exploreNodeFeatures(patterns: string[] = ['**/*--*.js']): Plugin {
  tty.test(stdout);

  return (stage: OnStage) => stage({
    'project:mount': async ({ suite }) => {
      const cwd = suite.uri;

      tty.newLine(stdout, tty.debug('explore features: '), tty.link(cwd));

      const files: string[] = [];
      patterns.forEach(x => files.push(...glob.sync(x, { cwd })));

      tty.newLine(stdout, tty.debug('explore features: '), tty.primary(`found ${files.length} possible matches`));
      tty.newLine(stdout);

      for (const file of files) {
        const featurePath = path.join(cwd, file);

        const sink = new TransactionSink([
          new OneFeaturePerFileConstraint(suite, featurePath),
          new UniqScenarioNameConstraint(suite, featurePath),
        ]);

        await sink.begin();

        require(featurePath);

        const features = suite.getScripts();

        // todo: remove RuntimeScript cast
        const feature = features[features.length - 1] as RuntimeScript;
        feature.path = featurePath;
        feature.name = path.parse(featurePath).name;

        await sink.commit();
      }
    }
  });
}

class OneFeaturePerFileConstraint implements Transaction {
  private numberAtStart = 0;

  constructor(
    private suite: Suite,
    private path: string
  ) {
  }

  async begin(): Promise<void> {
    this.numberAtStart = this.suite.getScripts().length;
  }

  async commit(): Promise<void> {
    const { numberAtStart, suite, path } = this;

    const numberAtEnt = suite.getScripts().length;
    const diff = numberAtEnt - numberAtStart;
    if (diff !== 1) {
      throw errors.constraint(`${path} expected 1 feature per file, got ${diff}`);
    }
  }
}

class UniqScenarioNameConstraint implements Transaction {
  constructor(
    private suite: Suite,
    private path: string
  ) {
  }

  async begin(): Promise<void> {
    return;
  }

  async commit(): Promise<void> {
    const scripts = this.suite.getScripts();
    const feature = scripts[scripts.length - 1];
    if (feature) {
      const set = new Set<string>();
      for (const scenario of feature.scenarios) {
        if (set.has(scenario.name)) {
          throw errors.constraint(`${this.path} contains not exclusive scenario name ${qte(scenario.name)}`);
        }

        set.add(scenario.name);
      }
    }
  }
}