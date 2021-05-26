import { Command, Script, Suite, TestFail, TestPass } from '@skintest/sdk';
import { Zone } from './zone';

export interface Stage<Z extends Zone, S> {
  token?: Z;
  (scope: S): Promise<void>;
}

export type StartScope = void;
export type StopScope = void;
export type InitScope = { suite: Suite };
export type ErrorScope = { reason: Error };

export type FeatureScope = { script: Script };
export type ScenarioScope = FeatureScope & { scenario: string };
export type StepScope = ScenarioScope & { step: Command };

export type CommandScope = StepScope & { site: Exclude<Zone, 'init' | 'destroy'> };
export type CommandPassScope = CommandScope & { result: TestPass };
export type CommandFailScope = CommandScope & { reason: TestFail | Error };

export type RecipeScope = CommandScope;
export type RecipePassScope = RecipeScope & { message: string };
export type RecipeFailScope = RecipeScope & { reason: Error };

export type Stages = {
  'start': Stage<'start', StartScope>;
  'stop': Stage<'stop', StopScope>;
  'init': Stage<'init', InitScope>;
  'error': Stage<'error', ErrorScope>

  'before.feature': Stage<'before.feature', FeatureScope>;
  'after.feature': Stage<'after.feature', FeatureScope>;
  'before.scenario': Stage<'before.scenario', ScenarioScope>;
  'after.scenario': Stage<'after.scenario', ScenarioScope>;
  'before.step': Stage<'before.step', StepScope>;
  'after.step': Stage<'after.step', StepScope>;

  'step': Stage<'step', CommandScope>;
  'step.pass': Stage<'step.pass', CommandPassScope>;
  'step.fail': Stage<'step.fail', CommandFailScope>;

  'recipe': Stage<'recipe', RecipeScope>;
  'recipe.pass': Stage<'recipe.pass', RecipePassScope>;
  'recipe.fail': Stage<'recipe.fail', RecipeFailScope>;
};

export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<void>;
export type OnStage = (stages: Partial<Stages>) => Promise<void>;