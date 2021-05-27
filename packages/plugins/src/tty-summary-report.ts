import { ticksToTime } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { performance } from 'perf_hooks';
import { tty } from './tty';

const { stdout } = process;

export function ttySummaryReport(): Plugin {
  const statistics = {
    features: 0,
    scenarios: 0,
    fails: 0,
    errors: 0
  };

  let startTime: number;

  return async (stage: OnStage) => stage({
    'start': async () => {
      startTime = performance.now();
    },
    'stop': async () => {
      const stopTime = performance.now();

      tty.newLine(stdout, `executed in ${ticksToTime(stopTime - startTime)}!`);
      tty.newLine(stdout);
      console.table(statistics);
    },
    'before.feature': async () => {
      statistics.features++;
    },
    'before.scenario': async () => {
      statistics.scenarios++;
    },
    'step.fail': async ({ reason }) => {
      if ('status' in reason) {
        statistics.fails++;
      } else {
        statistics.errors++;
      }
    },
    'recipe.fail': async () => {
      statistics.errors++;
    },
    'error': async () => {
      statistics.errors++;
    }
  });
}