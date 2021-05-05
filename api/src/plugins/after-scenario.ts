import { Plugin, PluginContext } from '../platform/plugin';
import { Execute } from './execute';

export function afterScenario(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'after.scenario': async ({ scenario }) => {
        const message = {
          feature: script.name,
          scenario,
        };

        const steps = execute(script.afterScenario, await reporting.afterScenario(message));
        return steps(context);
      }
    });
  }
}
