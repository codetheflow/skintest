import { OnStage, Plugin } from '@skintest/platform';
import { Command } from '@skintest/sdk';
import { tty } from './tty';

const { stdout, stderr } = process;
const TAG_RE = /(^|\s)(#[^\s$]+)(\s|$)/gi;

async function getMessage(command: Command): Promise<string> {
  try {
    const meta = await command.getMeta();
    return meta.rootage;
  } catch {
    return command.toString();
  }
}

const DEFAULT_OPTIONS: TTYReportOptions = {
  level: 0,
};

enum TTYReportOutputLevel {
  default = 0,
  verbose = 1,
}

type TTYReportOptions = {
  level: TTYReportOutputLevel,
};

export function ttyReport(options?: Partial<TTYReportOptions>): Plugin {
  const { level } = {
    ...DEFAULT_OPTIONS,
    ...options || {}
  };

  tty.test(stdout);

  return async (stage: OnStage) => stage({
    'project:mount': async () => {
      tty.newLine(stdout);
    },
    'project:unmount': async () => {
      tty.newLine(stdout);
    },
    'feature:before': async ({ script }) => {
      const info = await script.getMeta();
      tty.newLine(stdout, tty.h1(info.file + `:${info.line}:${info.column}`));
    },
    'scenario:before': async ({ scenario }) => {
      const label = scenario.replace(TAG_RE, (...args) => args[1] + tty.tag(args[2]) + args[3]);
      tty.newLine(stdout, tty.h2(label));
    },
    'step': async ({ site, step, path }) => {
      if (step.type === 'dev') {
        const message = await getMessage(step);
        tty.newLine(stdout, tty.dev(message));
        return;
      }

      if ((site === 'step' && path.length === 0) || level > 0) {
        const message = await getMessage(step);
        tty.newLine(stdout, tty.hidden(tty.CHECK_MARK), ' ', tty.info(message));
      }
    },
    'step:inspect': async ({ inspect }) => {
      await tty.writeInspect(stdout, inspect);
    },
    'step:pass': async ({ site, step, path }) => {
      if (step.type === 'dev') {
        return;
      }

      if ((site === 'step' && path.length === 0) || level > 0) {
        const message = await getMessage(step);
        tty.replaceLine(stdout, tty.pass(tty.CHECK_MARK), ' ', tty.info(message));
      }
    },
    'step:fail': async ({ reason, step, site, path }) => {
      // todo: make it better
      if ('status' in reason
        && (step.type === 'do'
          || step.toString().startsWith('perform')
          || step.toString().startsWith('event'))) {
        // inner error was shown, there is no need to duplicate it here
        return;
      }

      const message = await getMessage(step);
      const line = [tty.fail(tty.CROSS_MARK), ' ', tty.info(message)];
      if (site === 'step' && path.length === 0) {
        tty.replaceLine(stderr, ...line);
      } else {
        tty.newLine(stderr, ...line);
      }

      if ('status' in reason) {
        tty.writeFail(stderr, reason);
      } else {
        await tty.writeError(stderr, reason);
      }
    },
    'project:error': async ({ reason }) => {
      await tty.writeError(stderr, reason);
    }
  });
}