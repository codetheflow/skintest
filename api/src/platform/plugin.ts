import { Reporting } from '../platform/report-sink';
import { Browser } from '../sdk/browser';
import { Command } from '../sdk/command';
import { Script } from '../sdk/script';
import { Attempt } from './attempt';
import { Zone } from './zone';

export type Stage<Z extends Zone, S> = (scope: S) => Promise<PluginExecutionResult>;

export type InitScope = {};
export type DestroyScope = InitScope;
export type FeatureScope = { script: Script; browser: Browser };
export type ScenarioScope = FeatureScope & { scenario: string };
export type StepScope = ScenarioScope & { step: Command };

export type Stages = {
  'init': Stage<'init', InitScope>;
  'destroy': Stage<'destroy', DestroyScope>;
  'before.feature': Stage<'before.feature', FeatureScope>;
  'after.feature': Stage<'after.feature', FeatureScope>;
  'before.scenario': Stage<'before.scenario', ScenarioScope>;
  'after.scenario': Stage<'after.scenario', ScenarioScope>;
  'before.step': Stage<'before.step', StepScope>;
  'after.step': Stage<'after.step', StepScope>;
  'step': Stage<'step', StepScope>;
};

export type OnStage = (stages: Partial<Stages>) => Promise<PluginExecutionResult>;
export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<PluginExecutionResult>;

export function stage(plugins: Plugin[], pluginContext: Omit<PluginContext, 'stage'>): Staging {
  return <Z extends Zone>(zone: Z) =>
    async (...stageScope: Parameters<Stages[Z]>): Promise<PluginExecutionResult> => {
      const onStage: OnStage = async (stages: Partial<Stages>): Promise<PluginExecutionResult> => {
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
