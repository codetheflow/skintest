import { errors, extend, qte, Transaction, TransactionSink } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { RuntimeScript, Suite } from '@skintest/sdk';
import * as glob from 'glob';
import * as path from 'path';
import { stdout } from 'process';
import { tty } from './tty';

const DEFAULT_OPTIONS: ExploreNodeFeaturesOptions = {
  patterns: ['**/*--*.js'],
  grep: /.*/
};

type ExploreNodeFeaturesOptions = {
  patterns: string[],
  grep: RegExp,
};

export function exploreNodeFeatures(options: Partial<ExploreNodeFeaturesOptions> = {}): Plugin {
  tty.test(stdout);

  const { patterns, grep } = extend(DEFAULT_OPTIONS, options);

  return (stage: OnStage) => stage({
    'project:mount': async ({ suite }) => {
      const cwd = suite.uri;

      tty.newLine(stdout, tty.strong('explore features: '), tty.link(cwd));

      const fileNames: string[] = [];
      patterns.forEach(x => fileNames.push(...glob.sync(x, { cwd })));
      const paths = fileNames.map(x => path.join(cwd, x)).filter(x => grep.test(x));

      tty.newLine(stdout, tty.strong('explore features: '), 'found ', tty.pass(fileNames.length), ' possible matches');
      tty.newLine(stdout, tty.strong('explore features: '), 'skipped ', tty.warn(fileNames.length - paths.length), ' by grep ', '' + grep);
      tty.newLine(stdout);

      for (const featurePath of paths) {

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