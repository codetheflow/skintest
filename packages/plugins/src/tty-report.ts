import { isUndefined } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { Command, TestFail } from '@skintest/sdk';
import { tty } from './tty';
import chalk = require('chalk');

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
      tty.newLine(stdout, tty.h1(info.file + `:${info.line}:${info.column}`));
    },
    'feature:after': async ({ script }) => {
      if (Array.from(script.scenarios).length === 0) {
        return;
      }

      tty.newLine(stdout);
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
        tty.newLine(stdout, tty.ident(), tty.h2(datum[0] + 1), tty.h2('. '), tty.h2(stringify(datum[1])));
      }

      if (command.type === 'dev') {
        const commandText = await getText(command);
        tty.newLine(stdout, tty.dev(commandText));
        return;
      }

      const commandText = await getText(command);
      tty.newLine(stdout, tty.ident(), tty.hidden(tty.CHECK_MARK), ' ', tty.info(commandText));
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
          tty.replaceLine(stdout, tty.ident(), tty.pass(tty.CHECK_MARK), ' ', tty.info(commandText));
        }

        return;
      }

      const [, command] = step;
      let index = 0;
      for (const reason of issuer) {
        index++;

        const commandText = await getText(command);
        const line = [tty.ident(), tty.fail(tty.CROSS_MARK), ' ', tty.info(commandText)];
        if (site === 'step') {
          tty.replaceLine(stderr, ...line);
        } else {
          tty.newLine(stderr, ...line);
        }

        tty.newLine(stderr);

        if (reason instanceof Error) {
          tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) ${reason.name}:`));
          await tty.writeError(stderr, reason);
        } else {
          tty.newLine(stderr, tty.ident(2), tty.fail(`${index}) skintest.assertError:`));
          tty.writeFail(stderr, reason as TestFail);
          const meta = await command.getMeta();
          tty.newLine(stderr, tty.ident(3), tty.fail(` at (${meta.file}:${meta.line}:${meta.column})`));
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