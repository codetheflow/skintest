import { Plugin, PluginContext } from '../platform/plugin';
import { RunCommands } from './run-steps';

export function beforeStep(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'before.step': async ({ scenario, command }) => {
        const status = {
          feature: script.name,
          scenario: scenario,
          step: command.toString(),
        };

        const doSteps = runCommands(script.beforeStep, await reporting.beforeStep(status));
        return doSteps(context);
      }
    });
  }
}
