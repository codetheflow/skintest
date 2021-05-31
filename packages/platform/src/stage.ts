import { Browser, Command, Script, Suite, TestFail, TestPass } from '@skintest/sdk';
import { Zone } from './zone';

export interface Stage<Z extends Zone, S> {
  token?: Z;
  (scope: S): Promise<void>;
}

export type PlatformMount = void;
export type PlatformUnmount = void;

export type ProjectStartScope = { suite: Suite };
export type ProjectStopScope = ProjectStartScope;
export type ProjectInitScope = ProjectStartScope;
export type ProjectErrorScope = ProjectStartScope & { reason: Error };

export type FeatureScope = ProjectStartScope & { script: Script, browser: Browser };
export type ScenarioScope = FeatureScope & { scenario: string };
export type StepScope = ScenarioScope & { step: Command, depth: number };

export type CommandScope = StepScope & { site: Exclude<Zone, 'init' | 'destroy'> };
export type CommandPassScope = CommandScope & { result: TestPass };
export type CommandFailScope = CommandScope & { reason: TestFail | Error };

export type Stages = {
  'platform:mount': Stage<'platform:mount', PlatformMount>;
  'platform:unmount': Stage<'platform:unmount', PlatformUnmount>;
  'project:mount': Stage<'project:mount', ProjectStartScope>;
  'project:unmount': Stage<'project:unmount', ProjectStopScope>;
  'project:init': Stage<'project:init', ProjectInitScope>;
  'project:error': Stage<'project:error', ProjectErrorScope>

  'feature:before': Stage<'feature:before', FeatureScope>;
  'feature:after': Stage<'feature:after', FeatureScope>;
  
  'scenario:before': Stage<'scenario:before', ScenarioScope>;
  'scenario:after': Stage<'scenario:after', ScenarioScope>;

  'step:before': Stage<'step:before', StepScope>;
  'step:after': Stage<'step:after', StepScope>;
  'step': Stage<'step', CommandScope>;
  'step:pass': Stage<'step:pass', CommandPassScope>;
  'step:fail': Stage<'step:fail', CommandFailScope>;
};

export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<void>;
export type OnStage = (stages: Partial<Stages>) => Promise<void>;