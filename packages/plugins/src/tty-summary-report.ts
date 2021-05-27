import { ticksToTime } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { performance } from 'perf_hooks';
import { tty } from './tty';

const { stdout } = process;

export function ttySummaryReport(): Plugin {
  let startTime: number;
  const statistics = {
    features: 0,
    scenarios: 0,
    fails: 0,
    errors: 0
  };

  return async (stage: OnStage) => stage({
    'platform:mount': async () => {
      startTime = performance.now();
    },
    'platform:unmount': async () => {
      const stopTime = performance.now();

      tty.newLine(stdout, `executed in ${ticksToTime(stopTime - startTime)}!`);
      tty.newLine(stdout);
      console.table(statistics);
    },
    'feature:before': async () => {
      statistics.features++;
    },
    'scenario:before': async () => {
      statistics.scenarios++;
    },
    'step:fail': async ({ reason }) => {
      if ('status' in reason) {
        statistics.fails++;
      } else {
        statistics.errors++;
      }
    },
    'recipe:fail': async () => {
      statistics.errors++;
    },
    'project:error': async () => {
      statistics.errors++;
    }
  });
}