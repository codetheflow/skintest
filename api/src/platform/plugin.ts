import { Script } from '../sdk/script';
import { Reporting } from '../sdk/report-sink';
import { Command } from '../sdk/command';
import { Attempt } from '../sdk/attempt';
import { Engine } from '../sdk/engine';

export type StageZone =
  'init'
  | 'destroy'
  | 'before.feature'
  | 'after.feature'
  | 'before.scenario'
  | 'after.scenario'
  | 'before.step'
  | 'after.step'
  | 'step';

export type Stage<Z extends StageZone, T> = (context: T) => Promise<PluginExecutionResult>;

export type Stages = {
  'init': Stage<'init', {}>;
  'before.feature': Stage<'before.feature', {}>;
  'after.feature': Stage<'after.feature', {}>;
  'before.scenario': Stage<'before.scenario', { scenario: string }>;
  'after.scenario': Stage<'after.scenario', { scenario: string }>;
  'before.step': Stage<'before.step', { scenario: string, command: Command }>;
  'after.step': Stage<'after.step', { scenario: string, command: Command }>;
  'step': Stage<'step', { scenario: string, command: Command }>;
  'destroy': Stage<'destroy', {}>;
};

export type OnStage = (stages: Partial<Stages>) => Promise<PluginExecutionResult>;
export type Staging = <Z extends StageZone>(zone: Z, script: Script) => (...stageContext: Parameters<Stages[Z]>) => Promise<PluginExecutionResult>;

export function stage(plugins: Plugin[], pluginContext: Omit<PluginContext, 'stage' | 'script'>): Staging {
  return <Z extends StageZone>(zone: Z, script: Script) =>
    async (...stageContext: Parameters<Stages[Z]>): Promise<PluginExecutionResult> => {
      const onStage: OnStage = async (stages: Partial<Stages>): Promise<PluginExecutionResult> => {
        const hosts: string[] = [];
        for (let key in stages) {
          if (zone === key) {
            const execute = stages[zone];
            if (execute) {
              // todo: get rid of any
              const result = await execute(stageContext[0] as any);
              if (result.effect === 'break') {
                return pluginBreak(result.host)
              }

              hosts.push(result.host);
            }
          }
        }

        return pluginContinue(hosts.join(', '));
      };

      const context: PluginContext = {
        ...pluginContext,
        script,
        stage: onStage
      };

      const hosts: string[] = [];
      for (let plugin of plugins) {
        const result = await plugin(context);
        if (result.effect === 'break') {
          return pluginBreak(result.host);
        }
      }

      return pluginContinue(hosts.join(', ') || 'stage');
    };
}


export interface PluginContext {
  attempt: Attempt;
  engine: Engine;
  reporting: Reporting;
  script: Script;
  stage: OnStage;
}

export type Plugin = (context: PluginContext) => Promise<PluginExecutionResult>;

export interface PluginExecutionResult {
  host: string;
  effect: 'break' | 'continue';
};

export function pluginBreak(host: string): PluginExecutionResult {
  return {
    host,
    effect: 'break'
  };
}

export function pluginContinue(host: string): PluginExecutionResult {
  return {
    host,
    effect: 'continue'
  };
}
