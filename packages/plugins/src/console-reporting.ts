import { getMessage, OnStage, Plugin } from '@skintest/sdk';
import * as chalk from 'chalk';


export function consoleReporting(): Plugin {
  return async (stage: OnStage) => stage({
    'error': async ({ reason }) => {
      // todo: better reporting error
      console.error(reason);
    },
    'before.scenario': async ({ script, scenario }) => {
      console.log(chalk.whiteBright.bold(script.name) + '\\' + chalk.whiteBright(scenario));
    },
    'step': async ({ site, step }) => {
      if (step.type === 'dev') {
        const message = await getMessage(step);
        console.log(chalk.yellow(message));
        return;
      }

      if (site === 'step') {
        console.log(chalk.green('pass'));
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
              console.log(`$(\`${query}\`) found ${target.length} elements`);

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
            console.log(`$(\`${query}\`) found 1 element`);

            console.table({
              innerText: textForTable(await target.innerText())
            });

            return;
          }

          console.log(chalk.bgRed(`$(\`${query}\`) didn't find any elements`));
        }

        return;
      }

      if (site === 'step' && step.type !== 'do') {
        const message = await getMessage(step);
        console.log(chalk.grey(message));
      }
    },
    'step.fail': async ({ site, result, step }) => {
      if (site === 'step') {
        console.log(chalk.red('fail'));

        if ('status' in result) {
          console.log(chalk.bgRedBright.white(result.description));
        } else {
          if (result.stack) {
            console.log(chalk.red(result.stack));
          } else {
            console.log(chalk.bgRed(`${result.name}: ${result.message}`));
          }
        }
      }
    },
    'recipe.pass': async ({ site, message }) => {
      if (site === 'step') {
        console.log(chalk.green('pass'));
      }
    },
  });
}
