import { Plugin, PluginContext } from '../platform/plugin';
import { Plan } from './plan';

export function afterScenario(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;
    return stage({
      'after.scenario': async ({ browser, script, scenario }) => {
        const message = {
          feature: script.name,
          scenario,
        };

        const execute = plan(browser, reporting, attempt);
        return execute(script.afterScenario, await reporting.afterScenario(message));
      }
    });
  }
}
