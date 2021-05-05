import { Plugin, PluginContext } from '../platform/plugin';
import { Execute } from './execute';

export function afterStep(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'after.step': async ({ scenario, command }) => {
        const message = {
          feature: script.name,
          scenario,
          step: command.toString(),
        };

        const steps = execute(script.afterStep, await reporting.afterStep(message));
        return steps(context);
      }
    });
  }
}
