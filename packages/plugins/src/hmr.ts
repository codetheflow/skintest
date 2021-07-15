import { getCaller, getMeta, Guard, match, merge, Meta } from '@skintest/common';
import { OnStage, Plugin } from '@skintest/platform';
import { DevStep, Step, StepExecutionResult, tempSuite } from '@skintest/sdk';
import * as chokidar from 'chokidar';
import { stdout } from 'process';
import { tty } from './tty';

type HMROptions = {
  include: string,
};

type Hold = {
  continue(): void,
  step: number,
};

export function hmr(options: HMROptions): Plugin {
  const { include } = options;

  tty.test(stdout);

  let hold: Hold | null = null;

  return (stage: OnStage) => stage({
    'scenario:before': async ({ suite, script, scenario }) => {
      const test = match(scenario.name);
      if (test(include)) {
        chokidar
          .watch(script.path)
          .on('change', () => {
            if (hold !== null) {
              const [temp, dispose] = tempSuite();
              try {

                delete require.cache[script.path];
                require(script.path);

                const tempScript = temp.getScripts()[0];
                const tempScenario = Array.from(tempScript!.scenarios).find(x => x.name === scenario.name);
                const hotSteps = Array.from(tempScenario!.steps);
                const oldSteps = Array.from(scenario.steps).filter(x => !(x instanceof NoChangesStep));

                const compare = merge<Step>({
                  update: (l) => l,
                  equals: (l, r) => l[0] === r[0] && l[1].toString() === r[1].toString()
                });

                const diff = compare(
                  hotSteps,
                  oldSteps,
                  []
                );

                console.log(diff);

                const append = hotSteps
                  .filter(([i, x]) => i > hold!.step)
                  .map(([i, x]) => x);

                if (!append.length) {
                  const caller = getCaller();
                  append.push(new NoChangesStep(() => getMeta(caller)));
                }

                suite
                  .editScript(script)
                  .modifyScenario(scenario.name, { append })
                  .commit();

              } finally {
                dispose();
                hold.continue();
              }
            }
          });
      }
    },
    'step:after': ({ scenario, step }) => {
      const test = match(scenario.name);
      if (test(include)) {
        const steps = Array.from(scenario.steps);
        const [index] = step;
        const lastStep = index === steps.length - 1;
        if (lastStep) {
          tty.newLine(stdout, tty.dev(`waiting for the scenario changes...`));

          return new Promise((resolve) => {
            hold = {
              step: index,
              continue: resolve
            };
          });
        }
      }

      return Promise.resolve();
    },
  });
}

// function reload(module: NodeModule) {
//   const modulesToReload : string[] = [module.id];
//   let parentModule : NodeModule = module.parent;

//   while (parentModule && parentModule.id !== '.') {
//       modulesToReload.push(parentModule.id);
//       parentModule = parentModule.parent;
//   }

//   modulesToReload.forEach((id) => {
//      delete require.cache[id];
//   });
// }

class NoChangesStep<D> implements DevStep<D> {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<Meta>
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'method',
    };
  }

  toString(): string {
    return `no changes`;
  }
}