import { errors, escapeRE } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Suite } from '@skintest/sdk';

type TagFilter = {
  tags: string[],
  include: 'only-matched' | 'all-when-no-matched'
};

type Statistics = {
  [key: string]: {
    featureMatch: boolean,
    scenarioMatches: Set<string>,
  }
};

export function tagFilter(options: TagFilter): Plugin {
  const { tags, include } = options;

  return async (stage: OnStage) => stage({
    'init': async ({ suite }) => {

      const stat = getStat(suite, tags);
      const onlyMatched = () => {
        suite.operations.filterFeature = (feature: string) =>
          stat[feature].featureMatch ||
          stat[feature].scenarioMatches.size > 0;

        suite.operations.filterScenario = (feature: string, scenario: string) =>
          stat[feature].featureMatch ||
          stat[feature].scenarioMatches.has(scenario);
      };

      switch (include) {
        case 'only-matched': {
          onlyMatched();
          break;
        }
        case 'all-when-no-matched': {
          const hasMatches = Object
            .keys(stat)
            .some(key =>
              stat[key].featureMatch ||
              stat[key].scenarioMatches.size > 0
            );

          if (hasMatches) {
            onlyMatched();
          }

          break;
        }
        default: {
          throw errors.invalidArgument('include', include);
        }
      }
    }
  });
}

function matchHashTag(search: string) {
  return (tag: string) => {
    const contains = new RegExp(`(^|\\s)${escapeRE(tag)}(\\s|$)`, 'gi');
    return contains.test(search);
  };
}

function getStat(suite: Suite, tags: string[]): Statistics {
  const stat: Statistics = {};
  for (const script of suite.getScripts()) {
    stat[script.name] = {
      featureMatch: tags.some(matchHashTag(script.name)),
      scenarioMatches: new Set(
        script
          .scenarios
          .map(([name]) => name)
          .filter(name => tags.some(matchHashTag(name)))
      )
    };
  }

  return stat;
}