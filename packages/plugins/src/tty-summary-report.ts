import { Meta, ticksToTime } from '@skintest/common';
import { FeedbackResult, OnStage, Plugin } from '@skintest/platform';
import { Scenario, TestFail } from '@skintest/sdk';
import { performance } from 'perf_hooks';
import { stderr, stdout } from 'process';
import { getBorderCharacters, table, TableUserConfig } from 'table';
import { tty } from './tty';

const FEATURES_COL = 0;
const TIME_COL = 1;
const TESTS_COL = 2;
const PASSING_COL = 3;
const FAILING_COL = 4;
const SKIPPED_COL = 5;

type Row = [string, number | string, number | string, number | string, number | string, number | string];

function newRow(): Row {
  return ['', 0, 0, 0, 0, 0];
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
  header[FEATURES_COL] = tty.muted('features');
  header[TESTS_COL] = tty.muted('tests');
  header[FAILING_COL] = tty.muted('failing');
  header[PASSING_COL] = tty.muted('passing');
  header[SKIPPED_COL] = tty.muted('skipped');
  header[TIME_COL] = tty.muted();

  const summary: Array<Row> = [header];
  const failedScenarios = new Set<Scenario>();

  function currentRow(): Row {
    return summary[summary.length - 1];
  }

  return async (stage: OnStage) => stage({
    'platform:mount': async () => {
      startTime = performance.now();
    },
    'platform:unmount': async () => {
      const stopTime = performance.now();

      const config: TableUserConfig = {
        border: getBorderCharacters('norc'), // norc
        columns: {
          [FEATURES_COL]: { width: Math.min(40, Math.max(20, stdout.columns - 50)), wrapWord: false, paddingRight: 2, paddingLeft: 2 },
          [TESTS_COL]: { alignment: 'right', paddingRight: 2 },
          [FAILING_COL]: { alignment: 'right', paddingRight: 2 },
          [TIME_COL]: { paddingLeft: 2, paddingRight: 2, alignment: 'center' },
          [PASSING_COL]: { alignment: 'right', paddingRight: 2 },
          [SKIPPED_COL]: { alignment: 'right', paddingRight: 2 },
        },
        drawVerticalLine(lineIndex, columnCount) {
          return lineIndex === 0 || lineIndex === columnCount;
        },
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

        row[PASSING_COL] = (row[TESTS_COL] as number) - (row[FAILING_COL] as number) - (row[SKIPPED_COL] as number);
        if (!footer) {
          total[PASSING_COL] = (total[PASSING_COL] as number) + (row[PASSING_COL] as number);
        }

        const fails = row[FAILING_COL] as number;
        if (fails) {
          row[FEATURES_COL] = tty.fail(tty.CROSS_MARK) + ' ' + tty.primary(row[FEATURES_COL]);
          row[FAILING_COL] = tty.fail(fails);
        } else {
          row[FEATURES_COL] = tty.pass(row[PASSING_COL] ? tty.CHECK_MARK : ' ') + ' ' + (row[TESTS_COL] ? tty.primary(row[FEATURES_COL]) : tty.muted(row[FEATURES_COL]));
          row[FAILING_COL] = tty.muted('-');
        }

        if (footer) {
          row[FEATURES_COL] = fails
            ? tty.fail('  has failed tests!')
            : summary.length > 2 
              ? tty.pass('  all tests passed!')
              : tty.debug('  no tests found!');
        }

        if (row[TESTS_COL] === 0) {
          row[TESTS_COL] = tty.muted('-');
        } else {
          row[TESTS_COL] = tty.primary(row[TESTS_COL]);
        }

        if (row[SKIPPED_COL] === 0) {
          row[SKIPPED_COL] = tty.muted('-');
        } else {
          row[SKIPPED_COL] = tty.debug(row[SKIPPED_COL]);
        }

        if (row[PASSING_COL] === 0) {
          row[PASSING_COL] = tty.muted('-');
        } else {
          row[PASSING_COL] = tty.pass(row[PASSING_COL]);
        }

      });

      tty.newLine(stderr, tty.muted(table(summary, config)));

      if (issues.length) {
        tty.newLine(stderr, tty.primary('failures:'));
        let index = 0;
        for (const issue of issues) {
          if (issue.meta) {
            for (const reason of issue.issuer) {
              index++;

              if (reason instanceof Error) {
                tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) ${reason.name}:`));
                tty.newLine(stderr, tty.ident(3), tty.fail(` at (${issue.meta.file}:${issue.meta.line}:${issue.meta.column})`));
                await tty.writeError(stderr, reason);
              } else {
                tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) skintest.assertError:`));
                tty.newLine(stderr, tty.ident(3), tty.fail(` at (${issue.meta.file}:${issue.meta.line}:${issue.meta.column})`));
                tty.writeFail(stderr, reason as TestFail);
              } 

              tty.newLine(stderr);
            }
          }
        }
        tty.newLine(stderr);
      }
    },
    'feature:before': async ({ suite, script }) => {
      const row = newRow();
      row[FEATURES_COL] = script.name;
      row[TIME_COL] = performance.now();

      row[SKIPPED_COL] = suite.getHistory(script).filter(x => x.type === 'remove').length;
      row[TESTS_COL] = (row[SKIPPED_COL] as number) + Array.from(script.scenarios).length;

      summary.push(row);
    },
    'feature:after': async () => {
      const row = currentRow();
      row[TIME_COL] = tty.muted(ticksToTime(performance.now() - (row[TIME_COL] as number)));
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

        if (!failedScenarios.has(scenario)) {
          const credited = issues.findIndex(x => x.feature === script.name && x.scenario === scenario.name);
          if (!credited) {
            const row = currentRow();
            row[FAILING_COL] = (row[FAILING_COL] as number) + 1;
            failedScenarios.add(scenario);
          }
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
    }
  });
}