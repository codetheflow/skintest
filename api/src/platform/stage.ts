import { Browser } from '../sdk/browser';
import { Command } from '../sdk/command';
import { Script } from '../sdk/script';
import { Zone } from './zone';

export interface StageExecutionResult {
  host: string;
  // todo: think about `exit` effect
  effect: 'break' | 'continue';
};

export type Stage<Z extends Zone, S> = (scope: S) => Promise<StageExecutionResult>;

export type InitScope = void;
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

export type Staging = <Z extends Zone>(zone: Z) => (...stageScope: Parameters<Stages[Z]>) => Promise<StageExecutionResult>;
export type OnStage = (stages: Partial<Stages>) => Promise<StageExecutionResult>;