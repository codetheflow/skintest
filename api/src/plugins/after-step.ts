import { Plugin, PluginContext } from '../platform/plugin';
import { RunCommands } from './run-steps';

export function afterStep(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'after.step': async ({ scenario, command }) => {
        const status = {
          feature: script.name,
          scenario,
          step: command.toString(),
        };

        const doSteps = runCommands(script.afterStep, await reporting.afterStep(status));
        return doSteps(context);
      }
    });
  }
}
