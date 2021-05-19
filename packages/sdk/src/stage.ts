import { Command } from './command';
import { Script } from './script';
import { Suite } from './suite';
import { TestFail, TestPass } from './test-result';
import { Zone } from './zone';

// todo: better type
export type Stage<Z extends Zone, S> = (scope: S) => Promise<void>;

export type StartScope = void;
export type StopScope = void;
export type InitScope = { suite: Suite };
export type ErrorScope = { reason: Error };

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
