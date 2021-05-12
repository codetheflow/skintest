import { Plugin, PluginContext } from '../platform/plugin';
import { Plan } from './plan';

export function beforeStep(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;
    return stage({
      'before.step': async ({ browser, script, scenario, step }) => {
        const message = {
          feature: script.name,
          scenario: scenario,
          step: step.toString(),
        };

        const execute = plan(browser, reporting, attempt);
        return execute(script.beforeStep, await reporting.beforeStep(message));
      }
    });
  }
}
