import { OnStage, Plugin } from '@skintest/platform';

export function ttySummaryReport(): Plugin {
  const statistics = {
    features: 0,
    scenarios: 0,
    fails: 0,
    errors: 0
  };

  return async (stage: OnStage) => stage({
    'stop': async () => {
      console.log('run summary');
      console.table(statistics);
    },
    'before.feature': async () => {
      statistics.features++;
    },
    'before.scenario': async () => {
      statistics.scenarios++;
    },
    'step.fail': async () => {
      statistics.fails++;
    },
    'recipe.fail': async () => {
      statistics.fails++;
    },
    'error': async () => {
      statistics.errors
    }
  });
}