import { Plugin, PluginContext } from '../platform/plugin';
import { Plan } from './plan';

export function afterStep(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;
    return stage({
      'after.step': async ({ page, script, scenario, step }) => {
        const message = {
          feature: script.name,
          scenario,
          step: step.toString(),
        };

        const execute = plan(page, reporting, attempt);
        return execute(script.afterStep, await reporting.afterStep(message));
      }
    });
  }
}
