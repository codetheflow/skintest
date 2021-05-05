import { Plugin, PluginContext } from '../platform/plugin';
import { Execute } from './execute';

export function beforeScenario(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'before.scenario': async ({ scenario }) => {
        const message = {
          feature: script.name,
          scenario: scenario,
        };

        const steps = execute(script.beforeScenario, await reporting.beforeScenario(message));
        return steps(context);
      }
    });
  }
}
