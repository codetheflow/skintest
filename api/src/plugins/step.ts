import { invalidArgumentError } from '../common/errors';
import { Plugin, PluginContext } from '../platform/plugin';
import { Command } from '../sdk/command';
import { ReportStepMessage } from '../platform/report-sink';
import { Execute } from './execute';

export function step(execute: Execute): Plugin {
  return async (context: PluginContext) => {
    const { script, stage, reporting } = context;

    async function getReport(type: Command['type'], message: ReportStepMessage) {
      switch (type) {
        case 'assert': return await reporting.assert(message);
        case 'check': return await reporting.check(message);
        case 'dev': return await reporting.dev(message);
        case 'client': return await reporting.client(message);
        case 'info': return await reporting.info(message);
        case 'do': return await reporting.do(message);
        default: throw invalidArgumentError('type', type);
      }
    }

    return stage({
      'step': async ({ scenario, command }) => {
        const message = {
          feature: script.name,
          scenario,
          step: command.toString(),
        };

        const status = await getReport(command.type, message);
        const steps = execute([command], status);
        return steps(context);
      }
    });
  };
}
