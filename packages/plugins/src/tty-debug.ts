import { OnStage, Plugin } from '@skintest/platform';
import { tty } from './tty';

const { stdin, stdout, stderr } = process;

export function ttyDebug(): Plugin {
  tty.test(stdout);

  return async (stage: OnStage) => stage({
    'step:after': async ({ step }) => {
      // const [, command] = step;

      // if (command.type === 'dev' && command.toString() === '__pause') {
      //   tty.newLine(stdout, tty.debug(`- type a selector and hit ${tty.strong('ENTER')}`));
      //   tty.newLine(stdout, tty.debug(`- type ${tty.strong('CTRL+C')} to exit from pause`));
      //   tty.newLine(stdout);

      //   const rl = readline.createInterface({
      //     input: stdin,
      //     output: stdout,
      //     crlfDelay: Infinity,
      //     prompt: '',
      //     tabSize: 2,
      //     terminal: true
      //   });

      //   const inspect =
      //     (selector: string) =>
      //       Promise
      //         .resolve()
      //         .then(() => browser.getCurrentPage())
      //         .then(page => page.immediateQueryList(selector))
      //         .then(target => tty.writeInspect(stdout, { selector, target }));

      //   const answer = (selector: string) => {
      //     rl.pause();
      //     inspect(selector)
      //       .catch(ex => tty.writeError(stderr, ex))
      //       .finally(() => {
      //         rl.resume();
      //         rl.question('> ', answer);
      //       });
      //   };

      //   rl.question('> ', answer);

      //   rl.on('SIGINT', () => {
      //     rl.close();
      //   });

      //   await once(rl, 'close');
      // }
    },
  });
}