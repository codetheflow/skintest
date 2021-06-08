import { Browser } from './browser';
import { StepMeta } from './meta';
import { ConditionSchema, StorySchema } from './schema';
import { InspectInfo, TestResult } from './test-result';

export type Command =
  ClientStep
  | AssertStep
  | DevStep
  | DoStep
  | InfoStep
  | TestStep;

export interface StepContext {
  browser: Browser;
}

export type StepExecutionResult =
  StepExecutionAssertResult
  | StepExecutionConditionResult
  | StepExecutionInspectResult
  | StepExecutionMethodResult
  | StepExecutionPerformResult
  | StepExecutionRecipeResult
  | StepExecutionRepeatResult
  | StepExecutionWaitResult;

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

export type StepExecutionRecipeResult = {
  type: 'recipe',
  plan: Command[],
}

export type StepExecutionPerformResult = {
  type: 'perform',
  plan: StorySchema,
}

export type StepExecutionWaitResult = {
  type: 'wait',
  waiter: Command,
  trigger: StorySchema,
}

export type StepExecutionRepeatResult = {
  type: 'repeat',
  plan: ConditionSchema,
}

export type StepExecutionConditionResult = {
  type: 'condition',
  plan: ConditionSchema,
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
}

export async function methodResult(promise: Promise<void>): Promise<StepExecutionResult> {
  await promise;

  // if there were no exception return `ok`
  return {
    type: 'method',
  };
}