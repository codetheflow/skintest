import * as chalk from 'chalk';
import { WriteStream } from 'tty';

export const tty = {
  NEW_LINE: '\n',
  CARET: '\x1b[0G',
  CHECK_MARK: '\u2713',
  CROSS_MARK: '\u2613',

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
  value: chalk.redBright,

  replaceLine(stream: WriteStream, ...text: string[]): void {
    stream.clearScreenDown();

    const line = text.join('');
    stream.write(tty.CARET + line);
  },

  newLine(stream: WriteStream, ...text: string[]): void {
    const line = text.join('');
    stream.write(tty.NEW_LINE + line);
  },
};