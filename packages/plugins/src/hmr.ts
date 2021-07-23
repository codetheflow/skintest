import { compare, errors, match, qte, reinterpret, ticksToTime, Tidy } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Command, Step, Steps, tempSuite } from '@skintest/sdk';
import * as chokidar from 'chokidar';
import { stdout } from 'process';
import { tty } from './tty';

type HMROptions = {
  include: string,
};

type Wait = {
  stop(): void,
};

type Line = [string, Command];

export function hmr(options: HMROptions): Plugin {
  tty.test(stdout);

  const { include } = options;
  const tidy = new Tidy();

  let debug = startLog();
  let wait: Wait | null = null;

  return (stage: OnStage) => stage({
    'platform:unmount': async () => {
      await tidy.run();
    },
    'scenario:before': async ({ suite, script, scenario }) => {
      const test = match(scenario.name);
      if (test(include)) {
        const proceed = () => {
          if (wait) {
            wait.stop();
          }
        };

        const exit = (message: string) => {
          debug(message + ' - exit');

          tidy.run();
          proceed();
          wait = null;
        };

        let left = await getLines(scenario.steps);

        const watch = chokidar
          .watch(script.path)
          .on('change', () => {
            if (!wait) {
              return;
            }

            const cursor = left.length - 1;
            const [hotSuite, dispose] = tempSuite();
            delete require.cache[script.path];

            try {
              debug('module reload');
              require(script.path);
            } finally {
              dispose();
            }

            const hotScript = hotSuite.getScripts()[0];
            if (!hotScript) {
              exit('feature is not found');
              return;
            }

            const hotScenario = Array
              .from(hotScript.scenarios)
              .find(x => x.name === scenario.name);

            if (!hotScenario) {
              exit(`scenario ${qte(scenario.name)} is not found`);
              return;
            }

            getLines(Array.from(hotScenario.steps))
              .then(right => {
                const ops = compare(left, right, lineEquals);
                if (!ops.length) {
                  debug('no new steps, wait for changes');
                  return;
                }

                const newSteps: Step[] = [];
                for (const op of ops) {
                  switch (op.type) {
                    case 'add': {
                      if (op.rightIndex < cursor) {
                        if (notPure(op.rightItem)) {
                          exit('state changed by add');
                          return;
                        }
                      } else {
                        newSteps.push([op.rightIndex, op.rightItem[1]]);
                      }
                      break;
                    }
                    case 'del': {
                      if (op.leftIndex > cursor) {
                        throw errors.invalidOperation('unexpected del op');
                      }

                      if (notPure(op.leftItem)) {
                        exit('state changed by del');
                        return;
                      }

                      break;
                    }
                    case 'mov': {
                      if (op.leftIndex > cursor) {
                        throw errors.invalidOperation('unexpected mov op');
                      }

                      if (notPure(op.leftItem)) {
                        const ls = left.slice(0, op.leftIndex).filter(x => notPure(x));
                        const rs = right.slice(0, op.rightIndex).filter(x => notPure(x));

                        if (ls.length !== rs.length || ls.some((l, i) => l[0] !== rs[i][0])) {
                          exit('state changed by mov');
                          return;
                        }
                      } else if (op.rightIndex >= cursor) {
                        newSteps.push([op.rightIndex, op.rightItem[1]]);
                      }

                      break;
                    }
                    default: {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      throw errors.invalidArgument('type', reinterpret<any>(op).type);
                    }
                  }
                }

                left = right;
                if (newSteps.length) {
                  debug(`detect ${newSteps.length} new step(s)`);

                  newSteps.sort((a, b) => a[0] - b[0]);
                  const append = newSteps.map(x => x[1]);

                  suite
                    .editScript(script)
                    .modifyScenario(scenario.name, { append })
                    .commit();

                  proceed();
                } else {
                  debug('no impacting steps, wait for changes');
                }
              });

            tidy.add(() => watch.close());
          });

        if (!Array.from(scenario.steps).length) {
          debug = startLog();

          tty.newLine(stdout);
          debug('no steps, wait for changes');

          return new Promise((resolve) => {
            wait = {
              stop: resolve
            };
          });
        }
      }
    },
    'step': async ({ scenario, step, site, feedback }) => {
      const test = match(scenario.name);
      if (site === 'step' && test(include)) {
        const steps = Array.from(scenario.steps);
        const [index] = step;
        const isLast = index === steps.length - 1;
        const { signal } = await feedback.get();
        if (signal === 'exit' || isLast) {
          debug = startLog();

          tty.newLine(stdout);
          debug('end of scenario, wait for changes');

          return new Promise((resolve) => {
            wait = {
              stop: resolve
            };
          });
        }
      }

      return Promise.resolve();
    },
  });
}

function startLog() {
  const start = Date.now();
  return (message: string) => {
    tty.replaceLine(stdout, tty.debug('hmr'), ' ', tty.debug(message), ' ', tty.link('+' + ticksToTime(Date.now() - start)));
  };
}

async function getLines(steps: Steps): Promise<Line[]> {
  const result: Line[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, cmd] of steps) {
    const meta = await cmd.getMeta();
    result.push([meta.rootage, cmd]);
  }

  return result;
}

function notPure(line: Line): boolean {
  const cmd = line[1];
  return cmd.type === 'client'
    || cmd.type === 'do'
    || cmd.type === 'control';
}

function lineEquals(a: Line, b: Line): boolean {
  return a[0] === b[0];
}