import { Plugin, PluginContext } from '../platform/plugin';
import { Plan } from './plan';

export function beforeFeature(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;
    return stage({
      'before.feature': async ({ browser, script }) => {
        const message = {
          feature: script.name,
        };

        const execute = plan(browser, reporting, attempt);
        return execute(script.beforeFeature, await reporting.beforeFeature(message));
      }
    });
  }
}
