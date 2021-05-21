import { Browser } from './browser';
import { StepMeta } from './meta';
import { ClientRecipe, ServerRecipe } from './recipe';
import { TestExecutionResult } from './test-result';

export interface StepContext {
  browser: Browser;
}

export type Command =
  ClientStep
  | TestStep
  | AssertStep
  | DevStep
  | InfoStep
  | DoStep;

export interface CommandBody {
  execute(context: StepContext): Promise<TestExecutionResult>;
  toString(): string;
  meta: Promise<StepMeta>;
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
  recipe: ClientRecipe<any> | ServerRecipe<any>;
  args: any[];
}