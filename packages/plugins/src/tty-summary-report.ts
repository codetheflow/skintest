import { Meta, ticksToTime } from '@skintest/common';
import { FeedbackResult, OnStage, Plugin } from '@skintest/platform';
import { TestFail } from '@skintest/sdk';
import { performance } from 'perf_hooks';
import { stderr } from 'process';
import { getBorderCharacters, table, TableUserConfig } from 'table';
import { tty } from './tty';

const FEATURES_COL = 0;
const TESTS_COL = 1;
const FAILS_COL = 2;
const TIME_COL = 3;

type Row = [string, number | string, number | string, number | string];

function newRow(): Row {
  return ['', 0, 0, 0];
}

export function ttySummaryReport(): Plugin {
  tty.test(stderr);

  let startTime: number;

  const issues: Array<{
    stage: 'step' | 'project' | 'platform',
    issuer: FeedbackResult['issuer'],
    feature?: string,
    scenario?: string,
    meta?: Meta
  }> = [];

  const header = newRow();
  header[FEATURES_COL] = tty.info('features');
  header[TESTS_COL] = tty.info('tests');
  header[FAILS_COL] = tty.info('fails');
  header[TIME_COL] = tty.info('time');

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
        border: getBorderCharacters('norc'), // norc
        header: {
          content: headerStyle(`executed in ${ticksToTime(stopTime - startTime)}`),
        },
        columns: {
          [FEATURES_COL]: { wrapWord: true },
          [TESTS_COL]: { alignment: 'right' },
          [FAILS_COL]: { alignment: 'right' },
          [TIME_COL]: { paddingLeft: 2, paddingRight: 2, alignment: 'center' },
        }
      };

      statistics.forEach((row, i) => {
        const header = i === 0;
        if (header) {
          return;
        }

        const fails = row[FAILS_COL] as number;
        if (fails) {
          row[FEATURES_COL] = tty.fail(tty.CROSS_MARK) + ' ' + row[FEATURES_COL];
          row[FAILS_COL] = tty.fail(fails);
        } else {
          row[FEATURES_COL] = tty.pass(tty.CHECK_MARK) + ' ' + row[FEATURES_COL];
          row[FAILS_COL] = tty.info('-');
        }
      });

      tty.newLine(stderr, table(statistics, config));

      if (issues.length) {
        tty.newLine(stderr, tty.h2('failures:'));
        let index = 0;
        for (const issue of issues) {
          if (issue.meta) {
            for (const reason of issue.issuer) {
              index++;

              if (reason instanceof Error) {
                tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) ${reason.name}:`));
                await tty.writeError(stderr, reason);
              } else {
                tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) skintest.assertError:`));
                tty.writeFail(stderr, reason as TestFail);
                tty.newLine(stderr, tty.ident(3), tty.fail(` at (${issue.meta.file}:${issue.meta.line}:${issue.meta.column})`));
              }

              tty.newLine(stderr);
            }
          }
        }
        tty.newLine(stderr);
      }
    },
    'feature:before': async ({ script }) => {
      const row = newRow();
      row[FEATURES_COL] = script.name;
      row[TIME_COL] = performance.now();

      statistics.push(row);
    },
    'feature:after': async () => {
      const row = currentRow();
      row[TIME_COL] = tty.info(ticksToTime(performance.now() - (row[TIME_COL] as number)));
    },
    'step': async ({ feedback, script, scenario, step, path }) => {
      if (path.length > 0) {
        return;
      }

      const [, command] = step;
      const { issuer } = await feedback.get();
      const meta = await command.getMeta();
      const errors = issuer.filter(x => x instanceof Error || x.status === 'fail');

      if (errors.length) {
        issues.push({
          stage: 'step',
          feature: script.name,
          scenario: scenario.name,
          issuer: errors,
          meta
        });

        const credited = issues.findIndex(x => x.feature === script.name && x.scenario === scenario.name);
        if (!credited) {
          const row = currentRow();
          row[FAILS_COL] = (row[FAILS_COL] as number) + 1;
        }
      }
    },
    'project:error': async ({ reason }) => {
      issues.push({
        stage: 'project',
        issuer: [reason]
      });
    },
    'platform:error': async ({ reason }) => {
      issues.push({
        stage: 'platform',
        feature: '',
        scenario: '',
        issuer: [reason]
      });
    },
    'scenario:before': async () => {
      const row = currentRow();
      row[TESTS_COL] = (row[TESTS_COL] as number) + 1;
    }
  });
}