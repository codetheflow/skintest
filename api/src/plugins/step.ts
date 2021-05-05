import { invalidArgumentError } from '../common/errors';
import { Plugin, PluginContext } from '../platform/plugin';
import { Command } from '../sdk/command';
import { ReportStepContext } from '../sdk/report-sink';
import { RunCommands } from './run-steps';

export function step(runCommands: RunCommands): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;

    async function getReport(type: Command['type'], status: ReportStepContext) {
      switch (type) {
        case 'assert': return await reporting.assert(status);
        case 'check': return await reporting.check(status);
        case 'dev': return await reporting.dev(status);
        case 'client': return await reporting.client(status);
        case 'info': return await reporting.info(status);
        case 'do': return await reporting.do(status);
        default: throw invalidArgumentError('type', type);
      }
    }

    return stage({
      'step': async ({ scenario, command }) => {
        const status = {
          feature: script.name,
          scenario,
          step: command.toString(),
        };

        const stepReport = await getReport(command.type, status);
        const doSteps = runCommands([command], stepReport);
        return doSteps(context);
      }
    });
  };
}
