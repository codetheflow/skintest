import { Data } from '@skintest/common';
import { Browser, Scenario, Script, Step, StepExecutionResult, Suite } from '@skintest/sdk';
import { Feedback } from './feedback';
import { ScriptZone, Zone } from './zone';

export interface Stage<Z extends Zone, S, R = void> {
  token?: Z;
  (scope: S): Promise<R>;
}

export type StageSite = Exclude<ScriptZone, 'step:fail' | 'step:pass' | 'step:inspect'>;

export type PlatformMountScope = void;
export type PlatformUnmountScope = void;
export type PlatformReadyScope = void;
export type PlatformErrorScope = { reason: Error };

export type ProjectStartScope = { suite: Suite };
export type ProjectStopScope = ProjectStartScope;
export type ProjectReadyScope = ProjectStartScope;
export type ProjectErrorScope = ProjectStartScope & { reason: Error };

export type FeatureScope = ProjectStartScope & { script: Script, browser: Browser };

export type ScenarioScope = FeatureScope & { scenario: Scenario };

export type Datum = [number, Data | undefined];
export type StepScope = ScenarioScope & { step: Step, datum: Datum };

export type CommandScope = StepScope & { site: StageSite, path: Array<StepExecutionResult['type']>, feedback: Feedback };

export type Stages = {
  'platform:mount': Stage<'platform:mount', PlatformMountScope>;
  'platform:unmount': Stage<'platform:unmount', PlatformUnmountScope>;
  'platform:ready': Stage<'platform:ready', PlatformReadyScope>;
  'platform:error': Stage<'platform:error', PlatformErrorScope>

  'project:mount': Stage<'project:mount', ProjectStartScope>;
  'project:unmount': Stage<'project:unmount', ProjectStopScope>;
  'project:ready': Stage<'project:ready', ProjectReadyScope>;
  'project:error': Stage<'project:error', ProjectErrorScope>

  'feature:before': Stage<'feature:before', FeatureScope>;
  'feature:after': Stage<'feature:after', FeatureScope>;

  'scenario:before': Stage<'scenario:before', ScenarioScope>;
  'scenario:after': Stage<'scenario:after', ScenarioScope>;

  'step:before': Stage<'step:before', StepScope>;
  'step:after': Stage<'step:after', StepScope>;
  'step': Stage<'step', CommandScope>;
};

export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<void>;
export type OnStage = (stages: Partial<Stages>) => Promise<void>;