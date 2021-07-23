import { isUndefined } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Command, TestFail } from '@skintest/sdk';
import { tty } from './tty';

const { stdout, stderr } = process;
const TAG_RE = /(^|\s)(#[^\s$]+)(\s|$)/gi;

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
      if (Array.from(script.scenarios).length === 0) {
        return;
      }

      const info = await script.getMeta();
      tty.newLine(stdout, tty.link(info.file + `:${info.line}:${info.column}`));
    },
    'feature:after': async ({ script }) => {
      if (Array.from(script.scenarios).length === 0) {
        return;
      }

      tty.newLine(stdout);
    },
    'scenario:before': async ({ scenario }) => {
      const label = scenario.name.replace(TAG_RE, (...args) => args[1] + tty.tag(args[2]) + args[3]);
      tty.newLine(stdout, tty.primary(label));
    },
    'scenario:after': async () => {
      tty.newLine(stdout);
    },
    'step:before': async ({ step, datum }) => {
      const [index, command] = step;
      if (index === 0 && !isUndefined(datum[1])) {
        tty.newLine(stdout, tty.ident(), tty.primary(datum[0] + 1), tty.primary('. '), tty.primary(stringify(datum[1])));
      }

      if (command.type === 'dev') {
        const commandText = await getText(command);
        tty.newLine(stdout, tty.debug(commandText));
        return;
      }

      const commandText = await getText(command);
      tty.newLine(stdout, tty.ident(), tty.hidden(tty.CHECK_MARK), ' ', tty.muted(commandText));
    },
    'step': async ({ site, step, path, feedback }) => {
      if (path.length > 0) {
        // expecting that error will be propagated to the zero level
        return;
      }

      const { issuer } = await feedback.get();
      const issues = issuer.filter(x => x instanceof Error || x.status === 'fail');
      if (issues.length === 0) {
        const [, command] = step;
        if (command.type === 'dev') {
          return;
        }

        if (site === 'step') {
          const commandText = await getText(command);
          tty.replaceLine(stdout, tty.ident(), tty.pass(tty.CHECK_MARK), ' ', tty.muted(commandText));
        }

        return;
      }

      let index = 0;
      const [, command] = step;
      for (const reason of issues) {
        index++;

        const commandText = await getText(command);
        const line = [tty.ident(), tty.fail(tty.CROSS_MARK), ' ', tty.muted(commandText)];
        if (site === 'step') {
          tty.replaceLine(stderr, ...line);
        } else {
          tty.newLine(stderr, ...line);
        }

        tty.newLine(stderr);

        const meta = await command.getMeta();
        if (reason instanceof Error) {
          tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) ${reason.name}:`));
          tty.newLine(stderr, tty.ident(3), tty.fail(` at (${meta.file}:${meta.line}:${meta.column})`));
          await tty.writeError(stderr, reason);
        } else {
          tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) skintest.assertError:`));
          tty.newLine(stderr, tty.ident(3), tty.fail(` at (${meta.file}:${meta.line}:${meta.column})`));
          tty.writeFail(stderr, reason as TestFail);
        }

        tty.newLine(stderr);
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