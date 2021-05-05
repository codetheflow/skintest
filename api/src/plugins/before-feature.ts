import { Plugin, PluginContext } from '../platform/plugin';
import { RunCommands } from './run-steps';

export function beforeFeature(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;
    return stage({
      'before.feature': async () => {
        const message = {
          feature: script.name,
        };

        const doSteps = runCommands(script.beforeFeature, await reporting.beforeFeature(message));
        return doSteps(context);
      }
    });
  }
}
