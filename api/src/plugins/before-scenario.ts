import { Plugin, PluginContext } from '../platform/plugin';
import { Plan } from './plan';

export function beforeScenario(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;
    return stage({
      'before.scenario': async ({ browser, script, scenario }) => {
        const message = {
          feature: script.name,
          scenario: scenario,
        };

        const execute = plan(browser, reporting, attempt);
        return execute(script.beforeScenario, await reporting.beforeScenario(message));
      }
    });
  }
}
