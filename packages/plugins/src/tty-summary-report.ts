import { Meta, ticksToTime } from '@skintest/common';
import { FeedbackResult, OnStage, Plugin } from '@skintest/platform';
import { TestFail } from '@skintest/sdk';
import { performance } from 'perf_hooks';
import { stderr, stdout } from 'process';
import { getBorderCharacters, table, TableUserConfig } from 'table';
import { tty } from './tty';

const FEATURES_COL = 0;
const TIME_COL = 1;
const TESTS_COL = 2;
const FAILING_COL = 3;
const SKIPPED_COL = 4;

type Row = [string, number | string, number | string, number | string, number | string];

function newRow(): Row {
  return ['', 0, 0, 0, 0];
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
  header[FAILING_COL] = tty.info('failing');
  header[SKIPPED_COL] = tty.info('skipped');
  header[TIME_COL] = tty.info();

  const summary: Array<Row> = [header];

  function currentRow(): Row {
    return summary[summary.length - 1];
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
        // header: {
        //   content: headerStyle(`executed in ${ticksToTime(stopTime - startTime)}`),
        // },
        columns: {
          [FEATURES_COL]: { width: Math.max(40, stdout.columns - 50), wrapWord: false, paddingRight: 2, paddingLeft: 2 },
          [TESTS_COL]: { alignment: 'right', paddingRight: 2 },
          [FAILING_COL]: { alignment: 'right', paddingRight: 2 },
          [TIME_COL]: { paddingLeft: 2, paddingRight: 2, alignment: 'center' },
          [SKIPPED_COL]: { alignment: 'right', paddingRight: 2 },
        },
        drawVerticalLine(lineIndex, columnCount) {
          return lineIndex === 0 || lineIndex === columnCount;
        },
        // drawHorizontalLine(index, size) {
        //   return index > 0 && index < size;
        // }
      };

      const total = newRow();
      total[TESTS_COL] = summary.filter((x, i) => i !== 0).reduce((m, x) => m + (x[TESTS_COL] as number), 0);
      total[FAILING_COL] = summary.filter((x, i) => i !== 0).reduce((m, x) => m + (x[FAILING_COL] as number), 0);
      total[SKIPPED_COL] = summary.filter((x, i) => i !== 0).reduce((m, x) => m + (x[SKIPPED_COL] as number), 0);
      total[TIME_COL] = ticksToTime(stopTime - startTime);
      total[FEATURES_COL] = '';
      summary.push(total);

      summary.forEach((row, i) => {
        const header = i === 0;
        const footer = i === summary.length - 1;

        if (header) {
          return;
        }

        const fails = row[FAILING_COL] as number;
        if (fails) {
          row[FEATURES_COL] = tty.fail(tty.CROSS_MARK) + ' ' + tty.h2(row[FEATURES_COL]);
          row[FAILING_COL] = tty.fail(fails);
        } else {
          row[FEATURES_COL] = tty.pass(row[TESTS_COL] ? tty.CHECK_MARK : ' ') + ' ' + (row[TESTS_COL] ? tty.h2(row[FEATURES_COL]) : tty.info(row[FEATURES_COL]));
          row[FAILING_COL] = tty.info('-');
        }

        if (footer) {
          row[FEATURES_COL] = fails
            ? tty.fail('  has failed tests!')
            : tty.pass('  all tests passed!');
        }

        if (row[TESTS_COL] === 0) {
          row[TESTS_COL] = tty.info('-');
        } else {
          row[TESTS_COL] = tty.h2(row[TESTS_COL]);
        }

        if (row[SKIPPED_COL] === 0) {
          row[SKIPPED_COL] = tty.info('-');
        } else {
          row[SKIPPED_COL] = tty.dev(SKIPPED_COL);
        }

      });

      tty.newLine(stderr, tty.info(table(summary, config)));

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

      summary.push(row);
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
          row[FAILING_COL] = (row[FAILING_COL] as number) + 1;
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