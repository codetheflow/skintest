import { Plugin, PluginContext } from '../platform/plugin';
import { RunCommands } from './run-steps';

export function beforeScenario(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'before.scenario': async ({ scenario }) => {
        const status = {
          feature: script.name,
          scenario: scenario,
        };

        const doSteps = runCommands(script.beforeScenario, await reporting.beforeScenario(status));
        return doSteps(context);
      }
    });
  }
}
