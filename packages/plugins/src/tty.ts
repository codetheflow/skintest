import { ellipsis, errors, prettyStack, qte, StringDictionary } from '@skintest/common';
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
  path.join('common', 'src', 'retry.ts'),
  path.join('common', 'src', 'errors.ts'),
  path.join('common', 'src', 'guard.ts'),
  path.join('common', 'src', 'transaction.ts'),
  path.join('sdk', 'src', 'steps', 'task.ts'),

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
  ident: (count = 1): string => Array(count).fill('  ').join(''),

  debug: chalk.yellow,
  warn: chalk.yellow,
  error: chalk.bgRed.white,
  fail: chalk.red,
  link: chalk.cyan,
  primary: chalk.white,
  hidden: chalk.hidden,
  muted: chalk.grey,
  pass: chalk.green,
  tag: (text: string): string => chalk.bgGrey.black('[' + text + ']'),
  value: (text: string): string => qte(chalk.yellow(text)),
  strong: chalk.bold,

  test(stream: WriteStream): void {
    if (!stream.isTTY) {
      // tty.warn('tty is disabled');
      throw errors.invalidArgument(
        'stream',
        'tty is not supported, try to use terminal where tty is on'
      );
    }
  },

  replaceLine(stream: WriteStream, ...text: string[]): void {
    stream.clearLine(-1);

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
    const pivot = ['query', 'host', 'actual', 'etalon'];
    const isBinaryAssert = pivot.every(key => key in body);

    if (isBinaryAssert) {
      const selector = body.query.toString();
      const method = body.query.type === 'query' ? '$' : '$$';
      const host: AssertHost = body.host;

      tty.newLine(stream, tty.ident(3), ' ', tty.error(
        `${method}(${selector}).${host.what}: ` +
        `expected ${tty.value(body.actual)} ` +
        `to${host.no ? ' not' : ''} ${host.how} ` +
        `${tty.value(body.etalon)}`
      ));
    } else {
      tty.newLine(stream, tty.ident(3), ' ', tty.error(reason.description));
    }
  },

  async writeError(stream: WriteStream, reason: Error): Promise<void> {
    const message = reason.message || 'unknown error';
    tty.newLine(stream, tty.ident(3), ' ', tty.error(message));

    if (!KNOWN_ERRORS.has(reason.name) && reason.stack) {
      const stackTrace = await prettyStack(reason.stack);
      const tsFiles = stackTrace.filter(x => x.file && x.file.endsWith('.ts'));
      const jsFiles = stackTrace.filter(x => x.file && x.file.endsWith('.js'));

      (tsFiles.length ? tsFiles : jsFiles)
        .filter(x => !STACK_FUNC_IGNORE.some(func => x.function === func))
        .filter(x => !STACK_FILE_IGNORE.some(file => x.file.includes(file)))
        .map(x => `at (${x.file}:${x.line}:${x.column})`)
        .forEach(x => tty.newLine(stream, tty.ident(3), ' ', tty.fail(x)));
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
      tty.newLine(stream, tty.error(`$(${qte(selector)}) didn't find any elements`));
      return;
    }

    if (Array.isArray(target)) {
      tty.newLine(stream, `$(${qte(selector)}) found ${target.length} elements`);

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
      tty.newLine(stream, `$(${qte(selector)}) found 1 element`);

      const info: StringDictionary<unknown> = {
        tagName: ellipsis(await elementRef.tagName(), maxWidth),
        id: ellipsis(await elementRef.attribute('id') || '', maxWidth),
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