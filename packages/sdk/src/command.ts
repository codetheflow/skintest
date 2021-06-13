import { Browser } from './browser';
import { StepMeta } from './meta';
import { RecipeFunction } from './recipe';
import { RepeatWrite } from './repeat';
import { InspectInfo, TestResult } from './test-result';

export type Command =
  ClientStep
  | AssertStep
  | ControlStep
  | DevStep
  | DoStep
  | InfoStep
  | TestStep;

export interface StepContext {
  browser: Browser;
}

export type StepExecutionResult =
  StepExecutionConditionResult
  | StepExecutionEventResult
  | StepExecutionInspectResult
  | StepExecutionMethodResult
  | StepExecutionPerformResult
  | StepExecutionRecipeResult
  | StepExecutionRepeatResult
  | StepExecutionAssertResult;

export type StepExecutionInspectResult = {
  type: 'inspect',
  info: InspectInfo,
}

export type StepExecutionAssertResult = {
  type: 'assert',
  result: TestResult,
}

export type StepExecutionMethodResult = {
  type: 'method',
}

export type StepExecutionPerformResult = {
  type: 'perform',
  plan: Command[],
}

export type StepExecutionRecipeResult = {
  type: 'recipe',
  plan: Command[],
}

export type StepExecutionEventResult = {
  type: 'event',
  handler: Command,
  trigger: Command[],
}

export type StepExecutionRepeatResult = {
  type: 'repeat',
  till: Command[],
  plan: Command[],
  writes: RepeatWrite[],
}

export type StepExecutionConditionResult = {
  type: 'condition',
  cause: Command[],
  plan: Command[],
}

export interface CommandBody {
  execute(context: StepContext): Promise<StepExecutionResult>;
  getMeta(): Promise<StepMeta>;
  toString(): string;
}

export interface ClientStep extends CommandBody {
  type: 'client';
}

export interface TestStep extends CommandBody {
  type: 'test';
}

export interface AssertStep extends CommandBody {
  type: 'assert';
}

export interface DevStep extends CommandBody {
  type: 'dev';
}

export interface InfoStep extends CommandBody {
  type: 'info';
}

export interface DoStep extends CommandBody {
  type: 'do';
  recipe: RecipeFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[],
}

export interface ControlStep extends CommandBody {
  type: 'control';
}

export async function methodResult(promise: Promise<void>): Promise<StepExecutionResult> {
  await promise;

  // if there were no exception return `ok`
  return {
    type: 'method',
  };
}