import { errors, extend, match } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { ScriptBuilder } from '@skintest/sdk';

const DEFAULT_OPTIONS: TagFilterOptions = {
  include: [],
  exclude: [],
  method: 'include-only-matched',
};

type TagFilterOptions = {
  include: string[],
  exclude: string[],
  method: 'include-only-matched' | 'include-all-when-no-matches'
};

export function tagFilter(options: Partial<TagFilterOptions> = {}): Plugin {
  const { include, exclude, method } = extend(DEFAULT_OPTIONS, options);

  return async (stage: OnStage) => stage({
    'project:ready': async ({ suite }) => {
      const matches: string[] = [];
      const transaction: ScriptBuilder[] = [];
      for (const script of suite.getScripts()) {
        for (const scenario of script.scenarios) {
          const test = match(scenario.name);
          if ((exclude.length && exclude.some(test)) || (include.length && !include.some(test))) {
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