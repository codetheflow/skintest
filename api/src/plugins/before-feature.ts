import { Plugin, PluginContext } from '../platform/plugin';
import { Execute } from './execute';

export function beforeFeature(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'before.feature': async () => {
        const message = {
          feature: script.name,
        };

        const steps = execute(script.beforeFeature, await reporting.beforeFeature(message));
        return steps(context);
      }
    });
  }
}
