import { compare, errors, match, reinterpret, Tidy } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Command, Step, Steps, tempSuite } from '@skintest/sdk';
import * as chokidar from 'chokidar';
import { stdout } from 'process';
import { tty } from './tty';

type HMROptions = {
  include: string,
};

type Stop = {
  next(): void,
  command: Command,
};

export function hmr(options: HMROptions): Plugin {
  tty.test(stdout);

  const { include } = options;
  const tidy = new Tidy();

  let gStop: Stop | null = null;

  return (stage: OnStage) => stage({
    'platform:unmount': async () => {
      await tidy.run();
    },
    'scenario:before': async ({ suite, script, scenario }) => {
      const test = match(scenario.name);
      if (test(include)) {
        let gOldSteps = Array.from(scenario.steps);
        let gOldLines: Line[] = await getLines(scenario.steps);

        const watch = chokidar
          .watch(script.path)
          .on('change', () => {
            if (gStop) {
              const { command, next } = gStop;
              const cursor = gOldSteps.findIndex(x => x[1] === command);
              if (cursor < 0) {
                throw errors.invalidOperation(`${command} is not found`);
              }

              tty.replaceLine(stdout, tty.dev('file changed, cursor: ' + cursor));
              const [temp, dispose] = tempSuite();

              try {

                delete require.cache[script.path];
                require(script.path);

                const tempScript = temp.getScripts()[0];

                const tempScenario = Array.from(tempScript!.scenarios).find(x => x.name === scenario.name);
                const hotSteps = Array.from(tempScenario!.steps);

                getLines(hotSteps)
                  .then(right => {
                    const left = gOldLines;
                    const ops = compare(left, right, (a, b) => a[1] === b[1]);
                    if (!ops.length) {
                      tty.replaceLine(stdout, tty.dev('no changes, waiting...'));
                    }

                    const hasEffect = (line: Line) => {
                      const cmd = line[2];
                      return cmd.type === 'client'
                        || cmd.type === 'do'
                        || cmd.type === 'control';
                    };

                    let result: 'exit' | 'continue' = 'continue';
                    const appendLines: Step[] = [];
                    for (const op of ops) {
                      if (result === 'exit') {
                        break;
                      }

                      switch (op.type) {
                        case 'add': {
                          if (op.rightIndex < cursor) {
                            if (hasEffect(op.rightItem)) {
                              tty.replaceLine(stdout, tty.dev('added IO item before cursor, exit'));
                              result = 'exit';
                              break;
                            }

                            tty.replaceLine(stdout, tty.dev('added NOT-IO item before cursor, skip'));
                            break;
                          }

                          tty.replaceLine(stdout, tty.dev('added item after cursor, append'));
                          appendLines.push([op.rightIndex, op.rightItem[2]]);
                          break;
                        }
                        case 'del': {
                          if (op.leftIndex > cursor) {
                            throw errors.invalidOperation(`there should not be del op in the future`);
                          }

                          if (hasEffect(op.leftItem)) {
                            tty.replaceLine(stdout, tty.dev('deleted IO item, exit'));
                            result = 'exit';
                            break;
                          }

                          tty.replaceLine(stdout, tty.dev('deleted NOT-IO item, skip'));
                          break;
                        }
                        case 'mov': {
                          if (op.leftIndex > cursor) {
                            throw errors.invalidOperation(`there should not be mov op in the future`);
                          }

                          if (hasEffect(op.leftItem)) {
                            const leftSeq = left.slice(0, op.leftIndex).filter(x => hasEffect(x));
                            const rightSeq = right.slice(0, op.rightIndex).filter(x => hasEffect(x));

                            if (leftSeq.length !== rightSeq.length || leftSeq.some((l, i) => l[1] !== rightSeq[i][1])) {
                              tty.replaceLine(stdout, tty.dev('change IO items seq, exit'));
                              result = 'exit';
                            }

                            tty.replaceLine(stdout, tty.dev('no changes in IO items seq, continue'));
                            break;
                          }

                          if (op.rightIndex >= cursor) {
                            tty.replaceLine(stdout, tty.dev('move NOT-IO item after cursor, append'));
                            appendLines.push([op.rightIndex, op.rightItem[2]]);
                            break;
                          }

                          tty.replaceLine(stdout, tty.dev('move NOT-IO item before cursor, skip'));
                          break;
                        }
                        default: {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          throw errors.invalidArgument('type', reinterpret<any>(op).type);
                        }
                      }
                    }

                    if (result === 'continue') {
                      gOldSteps = hotSteps;
                      gOldLines = right;
                      gStop!.command = gOldSteps[gOldSteps.length - 1][1];

                      if (appendLines.length) {
                        appendLines.sort((a, b) => a[0] - b[0]);
                        const append = appendLines.map(x => x[1]);

                        suite
                          .editScript(script)
                          .modifyScenario(scenario.name, { append })
                          .commit();

                        next();
                      }
                    } else {
                      next();
                      gOldSteps = [];
                      gStop = null;
                    }
                  });

                tidy.add(() => watch.close());
              } finally {
                dispose();
              }
            }
          });
      }
    },
    'step:after': ({ scenario, step }) => {
      const test = match(scenario.name);
      if (test(include)) {
        const steps = Array.from(scenario.steps);
        const [index, command] = step;
        const lastStep = index === steps.length - 1;
        if (lastStep) {
          tty.newLine(stdout, tty.dev(`waiting for the scenario changes...`));

          return new Promise((resolve) => {
            gStop = {
              command,
              next: resolve
            };
          });
        }
      }

      return Promise.resolve();
    },
  });
}

// function reload(module: NodeModule) {
//   const modulesToReload : string[] = [module.id];
//   let parentModule : NodeModule = module.parent;

//   while (parentModule && parentModule.id !== '.') {
//       modulesToReload.push(parentModule.id);
//       parentModule = parentModule.parent;
//   }

//   modulesToReload.forEach((id) => {
//      delete require.cache[id];
//   });
// }

type Line = [number, string, Command];

async function getLines(steps: Steps): Promise<Line[]> {
  const result: Line[] = [];
  for (const [ix, cmd] of steps) {
    const meta = await cmd.getMeta();
    result.push([ix, meta.rootage, cmd]);
  }

  return result;
}