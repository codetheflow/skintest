import { isObject, isUndefined } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Command } from '@skintest/sdk';
import { tty } from './tty';

const { stdout, stderr } = process;
const TAG_RE = /(^|\s)(#[^\s$]+)(\s|$)/gi;
const IDENT = '  ';

async function getText(command: Command): Promise<string> {
  try {
    const meta = await command.getMeta();
    return meta.rootage;
  } catch {
    return command.toString();
  }
}


export function ttyReport(): Plugin {
  tty.test(stdout);

  return async (stage: OnStage) => stage({
    'feature:before': async ({ script }) => {
      const info = await script.getMeta();
      tty.newLine(stdout, tty.h1(info.file + `:${info.line}:${info.column}`));
    },
    'scenario:before': async ({ scenario }) => {
      const label = scenario.name.replace(TAG_RE, (...args) => args[1] + tty.tag(args[2]) + args[3]);
      tty.newLine(stdout, tty.h2(label));
    },
    'scenario:after': async () => {
      tty.newLine(stdout);
    },
    'step:before': async ({ step, datum }) => {
      const [index, command] = step;
      if (index === 0 && !isUndefined(datum[1])) {
        tty.newLine(stdout, IDENT, tty.h2(datum[0] + 1), tty.h2('. '), tty.h2(stringify(datum[1])));
      }

      if (command.type === 'dev') {
        const commandText = await getText(command);
        tty.newLine(stdout, tty.dev(commandText));
        return;
      }

      const commandText = await getText(command);
      tty.newLine(stdout, IDENT, tty.hidden(tty.CHECK_MARK), ' ', tty.info(commandText));
    },
    'step': async ({ site, step, path, feedback }) => {
      const { issuer, signal } = await feedback.get();
      if (signal === 'continue') {
        const [, command] = step;
        if (command.type === 'dev') {
          return;
        }

        if (site === 'step' && path.length === 0) {
          const commandText = await getText(command);
          tty.replaceLine(stdout, IDENT, tty.pass(tty.CHECK_MARK), ' ', tty.info(commandText));
        }
      } else {
        const [, command] = step;
        for (const reason of issuer) {
          // todo: make it better
          if (isObject(reason) && 'status' in reason
            && (command.type === 'do'
              || command.toString().startsWith('perform')
              || command.toString().startsWith('event'))) {
            // inner error was shown, there is no need to duplicate it here
            return;
          }

          const commandText = await getText(command);
          const line = [IDENT, tty.fail(tty.CROSS_MARK), ' ', tty.info(commandText)];
          if (site === 'step' && path.length === 0) {
            tty.replaceLine(stderr, ...line);
          } else {
            tty.newLine(stderr, ...line);
          }

          if (reason instanceof Error) {
            await tty.writeError(stderr, reason);
          } else if (isObject(reason) && 'status' in reason && reason.status === 'fail') {
            tty.writeFail(stderr, reason);
          } else {
            await tty.writeError(stderr, new Error('' + reason));
          }

          // show only first message
          // todo: make it better
          return;
        }
      }
    },
    'project:error': async ({ reason }) => {
      await tty.writeError(stderr, reason);
    },
    'platform:error': async ({ reason }) => {
      await tty.writeError(stderr, reason);
    }
  });
}

function stringify<T>(value: T): string {
  const text = JSON.stringify(value);
  return text;
}