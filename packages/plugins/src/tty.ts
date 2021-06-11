import { ellipsis, errors, padRight, prettyStack, StringDictionary } from '@skintest/common';
import { AssertHost, DOMElement, ElementRef, ElementState, InspectInfo, TestFail } from '@skintest/sdk';
import * as chalk from 'chalk';
import * as path from 'path';
import { WriteStream } from 'tty';

const KNOWN_ERRORS = new Set(['skintest.timeout']);

const STACK_FUNC_IGNORE = [
  '__awaiter',
  'fulfilled',
  'rejected',
];

const STACK_FILE_IGNORE = [
  path.join('platform', 'dist', 'src', 'attempt.js'),
  path.join('platform', 'src', 'attempt.ts'),
  path.join('common', 'src', 'errors.ts'),
  path.join('common', 'src', 'guard.ts'),
  // from playwright
  // todo: propagate it here for the launcher options
  path.join('lib', 'utils', 'stackTrace.js')
];

export const tty = {
  NEW_LINE: '\n',
  CARET: '\x1b[0G',
  CHECK_MARK: '\u2713',
  CROSS_MARK: '\u2613',
  PROMPT: '> ',

  logo: chalk.grey,
  dev: chalk.yellow,
  error: chalk.bgRedBright.white,
  fail: chalk.red,
  h1: chalk.cyan,
  h2: chalk.white,
  hidden: chalk.hidden,
  info: chalk.grey,
  pass: chalk.green,
  tag: chalk.bgGrey.white,
  testValue: chalk.redBright,
  shortcut: chalk.bold,

  test(stream: WriteStream): void {
    if (!stream.isTTY) {
      throw errors.invalidArgument(
        'stream',
        'tty is not supported, try to use terminal where tty is on'
      );
    }
  },

  replaceLine(stream: WriteStream, ...text: string[]): void {
    stream.clearScreenDown();

    const line = text.join('');
    stream.write(tty.CARET + line);
  },

  newLine(stream: WriteStream, ...text: string[]): void {
    const line = text.join('');
    stream.write(tty.NEW_LINE + line);
  },

  writeFail(stream: WriteStream, reason: TestFail): void {
    const { body } = reason;

    // todo: make it better
    const pivot = ['query', 'assert', 'actual', 'etalon'];
    const isBinaryAssert = pivot.every(key => key in body);

    if (isBinaryAssert) {
      const selector = body.query.toString();
      const method = body.query.type === 'query' ? '$' : '$$';
      const host: AssertHost = body.host;

      tty.newLine(stream, tty.fail(
        `${method}(${selector}).${host.what}: ` +
        `expected ${tty.testValue('`' + body.actual + '`')} ` +
        `to${host.no ? ' not' : ''} ${host.how} ` +
        `${tty.testValue('`' + body.etalon + '`')}`
      ));
    } else {
      tty.newLine(stream, tty.fail(reason.description));
    }
  },

  async writeError(stream: WriteStream, reason: Error): Promise<void> {
    const message = (reason.name || 'Error') + ': ' + (reason.message || 'unknown error');
    tty.newLine(stream, tty.error(padRight(message, stream.columns)));

    if (!KNOWN_ERRORS.has(reason.name) && reason.stack) {
      const stackTrace = await prettyStack(reason.stack);

      stackTrace
        .filter(x => x.file && x.file.endsWith('.ts'))
        .filter(x => !STACK_FUNC_IGNORE.some(func => x.function === func))
        .filter(x => !STACK_FILE_IGNORE.some(file => x.file.includes(file)))
        .map(x => `${x.function || 'at'} (${x.file}:${x.line}:${x.column})`)
        .forEach(x => tty.newLine(stream, tty.fail(x)));
    }
  },

  async writeInspect(stream: WriteStream, inspect: InspectInfo): Promise<void> {
    // eslint-disable-next-line prefer-const
    let { selector, target } = inspect;
    
    // width - column-size? * column-number
    const maxWidth = Math.max(8, stream.columns - 15 * 3);

    target = Array.isArray(target)
      ? target.length > 1
        ? target
        : target[0]
      : target;

    if (!target) {
      tty.newLine(stream, tty.error(`$(\`${selector}\`) didn't find any elements`));
      return;
    }

    if (Array.isArray(target)) {
      tty.newLine(stream, `$(\`${selector}\`) found ${target.length} elements`);

      const list: Array<StringDictionary<unknown>> = [];
      for (const element of target) {
        list.push({
          text: ellipsis(await element.text(), maxWidth),
          visible: await element.state('visible'),
          enabled: await element.state('enabled'),
        });
      }

      tty.newLine(stream);
      console.table(list);
    } else {
      const elementRef = target as ElementRef<DOMElement>;
      tty.newLine(stream, `$(\`${selector}\`) found 1 element`);

      const info: StringDictionary<unknown> = {
        text: ellipsis(await elementRef.text(), maxWidth),
        classList: ellipsis((await elementRef.classList()).toString(), maxWidth),
      };

      const addState = async (key: ElementState) => {
        try {
          info[key] = await elementRef.state(key);
          // eslint-disable-next-line no-empty
        } catch (ex) {
        }
      };

      // todo:
      // - write tag name
      // - write data-test- attributes or id if exists
      await addState('checked');
      await addState('editable');
      await addState('enabled');
      await addState('focused');
      await addState('visible');

      tty.newLine(stream);
      console.table(info);
    }
  }
};