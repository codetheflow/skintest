import { Command, Script, Suite, TestFail, TestPass } from '@skintest/sdk';
import { Zone } from './zone';

export interface Stage<Z extends Zone, S> {
  token?: Z;
  (scope: S): Promise<void>;
}

export type StartScope = { suite: Suite };
export type StopScope = StartScope;
export type InitScope = StartScope;
export type ErrorScope = StartScope & { reason: Error };

export type FeatureScope = StartScope & { script: Script };
export type ScenarioScope = FeatureScope & { scenario: string };
export type StepScope = ScenarioScope & { step: Command };

export type CommandScope = StepScope & { site: Exclude<Zone, 'init' | 'destroy'> };
export type CommandPassScope = CommandScope & { result: TestPass };
export type CommandFailScope = CommandScope & { reason: TestFail | Error };

export type RecipeScope = CommandScope;
export type RecipePassScope = RecipeScope & { message: string };
export type RecipeFailScope = RecipeScope & { reason: Error };

export type Stages = {
  'project:start': Stage<'project:start', StartScope>;
  'project:stop': Stage<'project:stop', StopScope>;
  'project:init': Stage<'project:init', InitScope>;
  'project:error': Stage<'project:error', ErrorScope>

  'feature:before': Stage<'feature:before', FeatureScope>;
  'feature:after': Stage<'feature:after', FeatureScope>;
  'scenario:before': Stage<'scenario:before', ScenarioScope>;
  'scenario:after': Stage<'scenario:after', ScenarioScope>;
  'step:before': Stage<'step:before', StepScope>;
  'step:after': Stage<'step:after', StepScope>;

  'step': Stage<'step', CommandScope>;
  'step:pass': Stage<'step:pass', CommandPassScope>;
  'step:fail': Stage<'step:fail', CommandFailScope>;

  'recipe': Stage<'recipe', RecipeScope>;
  'recipe:pass': Stage<'recipe:pass', RecipePassScope>;
  'recipe:fail': Stage<'recipe:fail', RecipeFailScope>;
};

export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<void>;
export type OnStage = (stages: Partial<Stages>) => Promise<void>;