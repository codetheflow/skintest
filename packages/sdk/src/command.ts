import { Browser } from './browser';
import { StepMeta } from './meta';
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
  StepExecutionAssertResult
  | StepExecutionConditionResult
  | StepExecutionInspectResult
  | StepExecutionMethodResult
  | StepExecutionPerformResult
  | StepExecutionRepeatResult
  | StepExecutionEventResult;

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

export type StepExecutionEventResult = {
  type: 'event',
  handler: Command,
  trigger: Command[],
}

export type StepExecutionRepeatResult = {
  type: 'repeat',
  till: Command[],
  plan: Command[],
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