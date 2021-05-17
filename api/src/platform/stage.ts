import { Command } from '../sdk/command';
import { Script } from '../sdk/script';
import { TestFail, TestPass } from '../sdk/test-result';
import { Zone } from './zone';

export type StageExecutionResult = void;

// todo: better type
export type Stage<Z extends Zone, S> = (scope: S) => Promise<StageExecutionResult>;

export type InitScope = void;
export type DestroyScope = InitScope;
export type PassScope = { site: 'init' | 'destroy' | 'runtime' };
export type FailScope = PassScope & { result: Error };

export type FeatureScope = { script: Script };
export type ScenarioScope = FeatureScope & { scenario: string };
export type StepScope = ScenarioScope & { step: Command };

export type CommandScope = StepScope & { site: Exclude<Zone, 'init' | 'destroy'> };
export type CommandPassScope = CommandScope & { result: TestPass };
export type CommandFailScope = CommandScope & { result: TestFail | Error };

export type RecipeScope = CommandScope;
export type RecipePassScope = RecipeScope & { message: string };
export type RecipeFailScope = RecipeScope & { result: Error };

export type Stages = {
  'init': Stage<'init', InitScope>;
  'destroy': Stage<'destroy', DestroyScope>;
  'pass': Stage<'pass', PassScope>,
  'fail': Stage<'pass', FailScope>

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

export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<StageExecutionResult>;
export type OnStage = (stages: Partial<Stages>) => Promise<StageExecutionResult>;
