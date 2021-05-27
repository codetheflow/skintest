import { ellipsis, padRight, prettyStack, StringDictionary } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { AssertHost, Command, DOMElement, ElementRef, ElementState, InspectInfo, TestFail } from '@skintest/sdk';
import * as path from 'path';
import { tty } from './tty';

const { stdout, stderr } = process;

const TAG_RE = /(^|\s)(#[^\s$]+)(\s|$)/gi;

const STACK_FUNC_IGNORE = [
  '__awaiter',
  'fulfilled',
  'rejected',
];

const KNOWN_ERRORS = new Set(['skintest.timeout']);

const STACK_FILE_IGNORE = [
  path.join('platform', 'dist', 'src', 'attempt.js'),
  path.join('platform', 'src', 'attempt.ts'),
  path.join('common', 'src', 'errors.ts'),
  // from playwright
  // todo: propagate it here for the launcher options
  path.join('lib', 'utils', 'stackTrace.js')
];

async function getMessage(command: Command): Promise<string> {
  try {
    const meta = await command.getMeta();
    return meta.rootage;
  } catch {
    return command.toString();
  }
}

async function writeError(reason: Error) {
  const message = (reason.name || 'Error') + ': ' + (reason.message || 'unknown error');
  tty.newLine(stderr, tty.error(padRight(message, stderr.columns)));

  if (!KNOWN_ERRORS.has(reason.name) && reason.stack) {
    const stackTrace = await prettyStack(reason.stack);

    stackTrace
      .filter(x => x.file)
      .filter(x => !STACK_FUNC_IGNORE.some(func => x.function === func))
      .filter(x => !STACK_FILE_IGNORE.some(file => x.file.includes(file)))
      .map(x => `${x.function || 'at'} (${x.file}:${x.line}:${x.column})`)
      .forEach(x => tty.newLine(stderr, tty.fail(x)));
  }
}

function writeFail(reason: TestFail) {
  const { body } = reason;

  // todo: make it better
  const pivot = ['query', 'assert', 'actual', 'etalon'];
  const isBinaryAssert = pivot.every(key => key in body);

  if (isBinaryAssert) {
    const selector = body.query.toString();
    const method = body.query.type === 'query' ? '$' : '$$';
    const assert: AssertHost = body.assert;

    tty.newLine(stderr, tty.fail(
      `${method}(${selector}).${assert.what}: ` +
      `expected ${tty.value('`' + body.actual + '`')} ` +
      `to ${assert.no ? 'not' : ''} ${assert.how} ` +
      `${tty.value('`' + body.etalon + '`')}`
    ));
  } else {
    tty.newLine(stderr, tty.fail(reason.description));
  }
}

async function writeInspect(inspect: InspectInfo) {
  // eslint-disable-next-line prefer-const
  let { selector, target } = inspect;
  const maxWidth = 40;

  target = Array.isArray(target)
    ? target.length > 1
      ? target
      : target[0]
    : target;

  if (!target) {
    tty.newLine(stderr, tty.error(`$(\`${selector}\`) didn't find any elements`));
    return;
  }

  if (Array.isArray(target)) {
    tty.newLine(stdout, `$(\`${selector}\`) found ${target.length} elements`);

    const list: Array<StringDictionary<unknown>> = [];
    for (const element of target) {
      list.push({
        text: ellipsis(await element.text(), maxWidth),
        visible: await element.state('visible'),
        enabled: await element.state('enabled'),
      });
    }

    tty.newLine(stdout);
    console.table(list);
  } else {
    const elementRef = target as ElementRef<DOMElement>;
    tty.newLine(stdout, `$(\`${selector}\`) found 1 element`);

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

    await addState('checked');
    await addState('editable');
    await addState('enabled');
    await addState('focused');
    await addState('visible');

    tty.newLine(stdout);
    console.table(info);
  }
}

export function ttyReport(): Plugin {
  return async (stage: OnStage) => stage({
    'project:start': async () => {
      tty.newLine(stdout);
    },
    'project:stop': async () => {
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
    'step': async ({ site, step }) => {
      if (step.type === 'dev') {
        const message = await getMessage(step);
        tty.newLine(stdout, tty.dev(message));
        return;
      }

      if (site === 'step') {
        const message = await getMessage(step);
        tty.newLine(stdout, tty.hidden(tty.CHECK_MARK), ' ', tty.info(message));
      }
    },
    'step:pass': async ({ site, step, result }) => {
      if (step.type === 'dev') {
        if (result.inspect) {
          await writeInspect(result.inspect);
          return;
        }
      }

      if (site === 'step') {
        const message = await getMessage(step);
        tty.replaceLine(stdout, tty.pass(tty.CHECK_MARK), ' ', tty.info(message));
      }
    },
    'recipe:pass': async ({ site, step }) => {
      if (site === 'step') {
        const message = await getMessage(step);
        tty.replaceLine(stdout, tty.pass(tty.CHECK_MARK), ' ', tty.info(message));
      }
    },
    'step:fail': async ({ reason, step }) => {
      const message = await getMessage(step);
      tty.replaceLine(stderr, tty.fail(tty.CROSS_MARK), ' ', tty.info(message));

      if ('status' in reason) {
        writeFail(reason);
      } else {
        await writeError(reason);
      }
    },
    'recipe:fail': async ({ reason, step }) => {
      const message = await getMessage(step);
      tty.replaceLine(stderr, tty.fail(tty.CROSS_MARK), ' ', tty.info(message));
      await writeError(reason);
    },
    'project:error': async ({ reason }) => {
      await writeError(reason);
    }
  });
}