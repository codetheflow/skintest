import { Plugin, PluginContext, pluginContinue } from '../platform/plugin';
import { RunCommands } from './run-steps';

export function afterFeature(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'after.feature': async () => {
        const message = {
          feature: script.name,
        };

        const doSteps = runCommands(script.afterFeature, await reporting.afterFeature(message));
        return doSteps(context);
      }
    });
  }
}
