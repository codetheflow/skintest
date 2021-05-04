import { Attempt } from './attempt';
import { Engine } from './engine';
import { ClientRecipe, ServerRecipe } from './recipe';
import { TestExecutionResult } from './test-result';

export interface StepContext {
  attempt: Attempt;
  engine: Engine;
}

export type Command =
  ClientStep
  | CheckStep
  | AssertStep
  | DevStep
  | InfoStep
  | DoStep;

export interface CommandBody {
  execute(context: StepContext): TestExecutionResult;
  toString(): string;
}

export interface ClientStep extends CommandBody {
  type: 'client';
}

export interface CheckStep extends CommandBody {
  type: 'check';
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
