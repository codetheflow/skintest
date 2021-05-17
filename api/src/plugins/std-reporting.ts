import * as chalk from 'chalk';
import { Plugin } from '../platform/plugin';
import { OnStage } from '../platform/stage';

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
    'fail': async ({ result }) => {
      // todo: better reporting error
      console.error(result);
    },
    'before.scenario': async ({ script, scenario }) => {
      currentLine = await fixedLine();
      currentLine(chalk.whiteBright.bold(script.name), '\\', chalk.whiteBright(scenario), NEW_LINE);
      currentLine = followLine();
    },
    'step': async ({ site, step }) => {
      if (site === 'step') {
        currentLine = await fixedLine();
        currentLine(chalk.hidden(CHECK_MARK), WS, chalk.grey(step.toString()));
      }
    },
    'step.pass': async ({ site, step }) => {
      if (site === 'step' && step.type !== 'do') {
        currentLine(chalk.green(CHECK_MARK), WS, chalk.grey(step.toString()), NEW_LINE);
        currentLine = followLine();
      }
    },
    'step.fail': async ({ site, result, step }) => {
      if (site === 'step') {
        currentLine(chalk.red(CROSS_MARK), WS, chalk.gray(step.toString()), NEW_LINE);
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
    }
  });
}
