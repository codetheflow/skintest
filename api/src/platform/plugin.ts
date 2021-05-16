import { Reporting } from '../platform/report-sink';
import { Attempt } from './attempt';
import { OnStage, StageExecutionResult, Stages, Staging } from './stage';
import { Zone } from './zone';

export function stage(plugins: Plugin[], pluginContext: Omit<PluginContext, 'stage'>): Staging {
  return <Z extends Zone>(zone: Z) =>
    async (...stageScope: Parameters<Stages[Z]>): Promise<StageExecutionResult> => {
      const onStage: OnStage = async (stages: Partial<Stages>): Promise<StageExecutionResult> => {
        const hosts: string[] = [];
        for (let key in stages) {
          if (zone === key) {
            const execute = stages[zone];
            if (execute) {
              // todo: get rid of any
              const result = await execute(stageScope[0] as any);
              if (result.effect === 'break') {
                return pluginBreak(result.host)
              }


              hosts.push(result.host);
            }
          }
        }

        return pluginContinue(hosts.join(', '));
      };

      const scope: PluginContext = {
        ...pluginContext,
        stage: onStage
      };

      const hosts: string[] = [];
      for (let plugin of plugins) {
        const result = await plugin(scope);
        if (result.effect === 'break') {
          return pluginBreak(result.host);
        }
      }

      return pluginContinue(hosts.join(', ') || 'stage');
    };
}

export interface PluginContext {
  attempt: Attempt;
  reporting: Reporting;
  stage: OnStage;
}

export type Plugin = (context: PluginContext) => Promise<StageExecutionResult>;


export function pluginBreak(host: string): StageExecutionResult {
  return {
    host,
    effect: 'break'
  };
}

export function pluginContinue(host: string): StageExecutionResult {
  return {
    host,
    effect: 'continue'
  };
}
