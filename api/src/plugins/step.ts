import { invalidArgumentError } from '../common/errors';
import { Plugin, PluginContext } from '../platform/plugin';
import { Command } from '../sdk/command';
import { ReportStepMessage } from '../platform/report-sink';
import { Plan } from './plan';

export function step(plan: Plan): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting, attempt } = context;

    async function getReport(type: Command['type'], message: ReportStepMessage) {
      switch (type) {
        case 'assert': return await reporting.assert(message);
        case 'test': return await reporting.test(message);
        case 'dev': return await reporting.dev(message);
        case 'client': return await reporting.client(message);
        case 'info': return await reporting.info(message);
        case 'do': return await reporting.do(message);
        default: throw invalidArgumentError('type', type);
      }
    }

    return stage({
      'step': async ({ page, scenario, step, script }) => {
        const message = {
          feature: script.name,
          scenario,
          step: step.toString(),
        };

        const status = await getReport(step.type, message);
        const execute = plan(page, reporting, attempt);
        return execute([step], status);
      }
    });
  };
}
