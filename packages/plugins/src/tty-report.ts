import { prettyStack } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Command } from '@skintest/sdk';
import * as chalk from 'chalk';
import * as path from 'path';

const { stdout, stderr, stdin } = process;

const dev = chalk.yellow;
const error = chalk.bgRedBright.white;
const fail = chalk.red;
const h1 = chalk.cyan;
const h2 = chalk.white;
const hidden = chalk.hidden;
const info = chalk.grey;
const pass = chalk.green;
const tag = chalk.bgGrey.white;

const CHECK_MARK = '\u2713';
const CROSS_MARK = '\u2613';
const NEW_LINE = '\n';
const WS = ' ';

const CURSOR_CODE = '\x1b[6n'
const CURSOR_RE = /\[(\d+)\;(\d+)R$/;

const TAG_RE = /(^|\s)(#[^\s$]+)(\s|$)/gi;

const STACK_FUNC_IGNORE = [
  '__awaiter',
  'fulfilled',
];

const STACK_FILE_IGNORE = [
  path.join('platform', 'dist', 'src', 'attempt.js'),
  path.join('platform', 'src', 'attempt.ts'),
  // from playwright
  path.join('lib', 'utils', 'stackTrace.js')
];

async function getMessage(command: Command): Promise<string> {
  try {
    const meta = await command.getMeta()
    return meta.rootage;
  } catch {
    return command.toString();
  }
}

export async function getCursor(): Promise<[number, number]> {
  // todo: nodemon doesn't work with this code after the first watch
  return new Promise((resolve, reject) => {
    stdin.setRawMode(true);

    stdin.once('data', data => {
      stdin.setRawMode(false);

      const match = CURSOR_RE.exec(data.toString());
      if (match) {
        const [x, y] = match.slice(1, 3).reverse().map(Number) as [number, number];
        resolve([x - 1, y - 1]);
      } else {
        reject('can\'t find terminal cursor position');
      }
    });

    stdout.write(CURSOR_CODE);
    stdout.emit('data', CURSOR_CODE);
  });
}

async function fixedLine() {
  const [x, y] = await getCursor();
  return (...text: string[]) => {
    stdout.cursorTo(x, y);
    stdout.clearScreenDown();

    const line = text.join('');
    return stdout.write(line);
  }
}

function followLine() {
  return (...text: string[]): boolean => stdout.write(text.join(''));
}

async function writeError(ex: Error) {
  stderr.write(error((ex.name || 'Error') + ': ' + (ex.message) || 'unknown error'));
  stderr.write(NEW_LINE);

  if (ex.name === 'skintest.timeout') {
    return;
  }

  if (ex.stack) {
    const frames = (await prettyStack(ex.stack))
      .filter(x => x.function && x.file)
      .filter(x => !STACK_FUNC_IGNORE.some(func => x.function === func))
      .filter(x => !STACK_FILE_IGNORE.some(file => x.file.includes(file)))
      .map(x => `${x.function} (${x.file}:${x.line}:${x.column})`);

    stderr.write(fail(frames.join(NEW_LINE)));
    stderr.write(NEW_LINE);
  }
}

export function ttyReport(): Plugin {
  if (!stdin.isTTY) {
    // todo: safe tty operations
    // todo: throw meaningful error?
  }

  let currentLine = followLine();

  return async (stage: OnStage) => stage({
    'start': async () => {
      stdin.setEncoding('utf8');
      stdin.setRawMode(true);
      stdin.resume();
    },
    'stop': async () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.end();
    },
    'before.feature': async ({ script }) => {
      const info = await script.getMeta();
      currentLine(h1(info.file + `:${info.line}:${info.column}`), NEW_LINE);
      currentLine = followLine();
    },
    'before.scenario': async ({ scenario }) => {
      currentLine = await fixedLine();
      const label = scenario.replace(TAG_RE, (...args) =>
        args[1] + tag(args[2]) + args[3]);

      currentLine(h2(label), NEW_LINE);
      currentLine = followLine();
    },
    'step': async ({ site, step }) => {
      if (step.type === 'dev') {
        const message = await getMessage(step);
        currentLine(dev(message, NEW_LINE));
        currentLine = followLine();
        return;
      }

      if (site === 'step') {
        currentLine = await fixedLine();
        const message = await getMessage(step);
        currentLine(hidden(CHECK_MARK), WS, info(message));
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

          stdout.write(error(`$(\`${query}\`) didn't find any elements`));
          stdout.write(NEW_LINE);
        }

        return;
      }

      if (site === 'step') {
        const message = await getMessage(step);
        currentLine(pass(CHECK_MARK), WS, info(message), NEW_LINE);
        currentLine = followLine();
      }
    },
    'recipe.pass': async ({ site, step }) => {
      if (site === 'step') {
        const message = await getMessage(step);
        currentLine(pass(CHECK_MARK), WS, info(message), NEW_LINE);
        currentLine = followLine();
      }
    },
    'step.fail': async ({ reason, step }) => {
      const message = await getMessage(step);
      currentLine(fail(CROSS_MARK), WS, info(message), NEW_LINE);
      currentLine = followLine();

      if ('status' in reason) {
        stderr.write(error(reason.description));
        stderr.write(NEW_LINE);
      } else {
        await writeError(reason);
      }
    },
    'recipe.fail': async ({ reason, step }) => {
      const message = await getMessage(step);
      currentLine(fail(CROSS_MARK), WS, info(message), NEW_LINE);
      currentLine = followLine();
      await writeError(reason);
    },
    'error': async ({ reason }) => await writeError(reason),
  });
}