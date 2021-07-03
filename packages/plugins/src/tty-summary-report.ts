import { Meta, ticksToTime } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { TestFail } from '@skintest/sdk';
import { performance } from 'perf_hooks';
import { getBorderCharacters, table, TableUserConfig } from 'table';
import { tty } from './tty';

const { stdout } = process;

const FEATURES_COL = 0;
const SCENARIOS_COL = 1;
const FAILED_COL = 2;
const TIME_COL = 3;

type Row = [string, number | string, number | string, number | string];

function newRow(): Row {
  return ['', 0, 0, 0];
}

export function ttySummaryReport(): Plugin {
  tty.test(stdout);

  let startTime: number;

  const issues: Array<{
    stage: 'step' | 'project' | 'platform',
    reason: TestFail | Error,
    feature?: string,
    scenario?: string,
    meta?: Meta
  }> = [];

  const header = newRow();
  header[FEATURES_COL] = 'features';
  header[SCENARIOS_COL] = 'scenarios';
  header[FAILED_COL] = 'failed';
  header[TIME_COL] = 'time';

  const statistics: Array<Row> = [header];

  function currentRow(): Row {
    return statistics[statistics.length - 1];
  }

  return async (stage: OnStage) => stage({
    'platform:mount': async () => {
      startTime = performance.now();
    },
    'platform:unmount': async () => {
      const stopTime = performance.now();

      const headerStyle = issues.length ? tty.error : tty.pass;
      const config: TableUserConfig = {
        border: getBorderCharacters('ramac'), // norc
        header: {
          content: headerStyle(`executed in ${ticksToTime(stopTime - startTime)}`),
        },
        columns: {
          [FEATURES_COL]: { wrapWord: true },
          [SCENARIOS_COL]: { alignment: 'right' },
          [FAILED_COL]: { alignment: 'right' },
          [TIME_COL]: { paddingLeft: 2, paddingRight: 2, alignment: 'center' },
        }
      };

      statistics.forEach((row, i) => {
        const header = i === 0;
        if (header) {
          return;
        }

        const fails = row[FAILED_COL] as number;
        if (fails) {
          row[FAILED_COL] = tty.fail(fails);
        }
      });

      stdout.write(table(statistics, config));

      if (issues.length) {
        tty.newLine(stdout, tty.fail('ERRORS:'));
        for (const issue of issues) {
          if (issue.meta) {
            const { scenario, meta } = issue;
            tty.newLine(stdout, scenario as string);
            tty.newLine(stdout, tty.h1(`${meta.file}:${meta.line}:${meta.column}`));
          }

          tty.newLine(stdout);
        }
      }
    },
    'feature:before': async ({ script }) => {
      const row = newRow();
      row[FEATURES_COL] = script.name;
      row[SCENARIOS_COL] = script.scenarios.length;
      row[TIME_COL] = performance.now();

      statistics.push(row);
    },
    'feature:after': async () => {
      const row = currentRow();
      row[TIME_COL] = ticksToTime(performance.now() - (row[TIME_COL] as number));
    },
    'step:fail': async ({ reason, script, scenario, step }) => {
      const [_, command] = step;
      const meta = await command.getMeta();
      issues.push({
        stage: 'step',
        feature: script.name,
        scenario: scenario.name,
        reason,
        meta
      });

      const credited = issues.findIndex(x => x.feature === script.name && x.scenario === scenario.name);
      if (!credited) {
        const row = currentRow();
        row[FAILED_COL] = (row[FAILED_COL] as number) + 1;
      }
    },
    'project:error': async ({ reason }) => {
      issues.push({
        stage: 'project',
        reason
      });
    },
    'platform:error': async ({ reason }) => {
      issues.push({
        stage: 'platform',
        feature: '',
        scenario: '',
        reason
      });
    }
  });
}