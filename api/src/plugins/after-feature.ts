import { Plugin, PluginContext, pluginContinue } from '../platform/plugin';
import { Execute } from './execute';

export function afterFeature(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'after.feature': async () => {
        const message = {
          feature: script.name,
        };

        const steps = execute(script.afterFeature, await reporting.afterFeature(message));
        return steps(context);
      }
    });
  }
}
