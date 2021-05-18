import * as chalk from 'chalk';
import { Plugin } from '../platform/plugin';
import { OnStage } from '../platform/stage';
import { getMessage } from '../sdk/command';

const { stdout, stderr, stdin } = process;

const CHECK_MARK = '\u2713';
const CROSS_MARK = '\u2613';
const NEW_LINE = '\n';
const WS = ' ';

const CURSOR_CODE = '\x1b[6n'
const CURSOR_PATTERN = /\[(\d+)\;(\d+)R$/;

export function getCursor(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    stdin.setRawMode(true);

    stdin.once('data', data => {
      stdin.setRawMode(false);

      const match = CURSOR_PATTERN.exec(data.toString());
      if (match) {
        const [x, y] = match.slice(1, 3).reverse().map(Number) as [number, number];
        resolve([x - 1, y - 1]);
      } else {
        reject('can\'t find terminal cursor position');
      }
    });

    stdout.write(CURSOR_CODE);
  });
}

async function fixedLine() {
  stdin.resume();

  const [x, y] = await getCursor();
  return (...text: string[]) => {
    stdout.cursorTo(x, y);
    stdout.clearScreenDown();

    const line = text.join('');
    return stdout.write(line);
  }
}

function followLine() {
  stdin.pause();
  return (...text: string[]): boolean => stdout.write(text.join(''));
}

export function stdReporting(): Plugin {
  let currentLine = followLine();

  return async (stage: OnStage) => stage({
    'error': async ({ reason }) => {
      // todo: better reporting error
      console.error(reason);
    },
    'before.scenario': async ({ script, scenario }) => {
      currentLine = await fixedLine();
      currentLine(chalk.whiteBright.bold(script.name), '\\', chalk.whiteBright(scenario), NEW_LINE);
      currentLine = followLine();
    },
    'step': async ({ site, step }) => {
      if (step.type === 'dev') {
        const message = await getMessage(step);
        currentLine(chalk.yellow(message, NEW_LINE));
        currentLine = followLine();
        return;
      }

      if (site === 'step') {
        currentLine = await fixedLine();
        const message = await getMessage(step);
        currentLine(chalk.hidden(CHECK_MARK), WS, chalk.grey(message));
      }
    },
    'step.pass': async ({ site, step, result }) => {
      if (step.type === 'dev') {
        if (result.inspect) {
          let { selector: query, target } = result.inspect;

          const textForTable = (text: string): string => {
            if (!text) {
              return text;
            }

            const MAX_LENGTH = 40;
            if (text.length < MAX_LENGTH) {
              return text;
            }

            return text.substring(0, MAX_LENGTH) + '...';
          };

          if (Array.isArray(target)) {
            if (target.length > 1) {
              stdout.write(`$(\`${query}\`) found ${target.length} elements`);
              stdout.write(NEW_LINE);

              const list: any[] = [];
              for (const element of target) {
                const text = textForTable(await element.innerText());
                list.push({
                  innerText: text
                });
              }

              console.table(list);
              return;
            }

            target = target[0];
          }

          if (target) {
            stdout.write(`$(\`${query}\`) found 1 element`);
            stdout.write(NEW_LINE);

            console.table({
              innerText: textForTable(await target.innerText())
            });

            return;
          }

          stdout.write(chalk.bgRed(`$(\`${query}\`) didn't find any elements`));
          stdout.write(NEW_LINE);
        }

        return;
      }

      if (site === 'step' && step.type !== 'do') {
        const message = await getMessage(step);
        currentLine(chalk.green(CHECK_MARK), WS, chalk.grey(message), NEW_LINE);
        currentLine = followLine();
      }
    },
    'step.fail': async ({ site, result, step }) => {
      if (site === 'step') {
        const message = await getMessage(step);
        currentLine(chalk.red(CROSS_MARK), WS, chalk.gray(message), NEW_LINE);
        currentLine = followLine();

        if ('status' in result) {
          stderr.write(chalk.hidden(CROSS_MARK));
          stderr.write(WS);
          stderr.write(chalk.bgRedBright.white(result.description));
          stderr.write(NEW_LINE);
        } else {
          if (result.stack) {
            stderr.write(chalk.red(result.stack));
          } else {
            stderr.write(chalk.bgRed(`${result.name}: ${result.message}`));
          }

          stderr.write(NEW_LINE);
        }
      }
    },
    'recipe.pass': async ({ site, message }) => {
      if (site === 'step') {
        currentLine(chalk.green(CHECK_MARK), WS, chalk.grey(message), NEW_LINE);
        currentLine = followLine();
      }
    },
  });
}
