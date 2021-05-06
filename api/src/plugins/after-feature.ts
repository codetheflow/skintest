import { Plugin, PluginContext } from '../platform/plugin';
import { Plan } from './plan';

export function afterFeature(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;
    return stage({
      'after.feature': async ({ page, script }) => {
        const message = {
          feature: script.name,
        };

        const execute = plan(page, reporting, attempt);
        return execute(script.afterFeature, await reporting.afterFeature(message));
      }
    });
  }
}
