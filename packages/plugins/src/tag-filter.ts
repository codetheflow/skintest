import { errors, escapeRE } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { ScriptBuilder } from '@skintest/sdk';

type TagFilterOptions = {
  include: string[],
  method: 'include-only-matched' | 'include-all-when-no-matches'
};

export function tagFilter(options: TagFilterOptions): Plugin {
  const { include, method } = options;

  return async (stage: OnStage) => stage({
    'project:ready': async ({ suite }) => {
      const matches: string[] = [];
      const transaction: ScriptBuilder[] = [];
      for (const script of suite.getScripts()) {
        for (const scenario of script.scenarios) {
          if (!include.some(matchHashTag(scenario.name))) {
            transaction.push(
              suite
                .editScript(script)
                .removeScenario(scenario.name)
            );
          } else {
            matches.push(scenario.name);
          }
        }
      }

      switch (method) {
        case 'include-only-matched': {
          transaction.forEach(x => x.commit());
          break;
        }
        case 'include-all-when-no-matches': {
          if (matches.length) {
            transaction.forEach(x => x.commit());
          }
          break;
        }
        default: {
          throw errors.invalidArgument('method', method);
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