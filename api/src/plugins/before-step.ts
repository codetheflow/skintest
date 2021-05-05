import { Plugin, PluginContext } from '../platform/plugin';
import { Execute } from './execute';

export function beforeStep(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'before.step': async ({ scenario, command }) => {
        const message = {
          feature: script.name,
          scenario: scenario,
          step: command.toString(),
        };

        const steps = execute(script.beforeStep, await reporting.beforeStep(message));
        return steps(context);
      }
    });
  }
}
