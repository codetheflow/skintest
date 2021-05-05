import { Plugin, PluginContext } from '../platform/plugin';
import { RunCommands } from './run-steps';

export function afterScenario(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'after.scenario': async ({ scenario }) => {
        const status = {
          feature: script.name,
          scenario,
        };

        const doSteps = runCommands(script.afterScenario, await reporting.afterScenario(status));
        return doSteps(context);
      }
    });
  }
}
