import { Browser } from './browser';
import { StepMeta } from './meta';
import { pass, TestResult } from './test-result';

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

export type StepExecutionResult = Promise<{
  result: TestResult,
  plans: Command[][],
}>;

export interface CommandBody {
  execute(context: StepContext): StepExecutionResult;
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

export async function asTest(promise: Promise<void>): StepExecutionResult {
  await promise;

  // if there were no exception return `ok`
  return {
    result: pass(),
    plans: []
  };
}