import { Attempt } from './attempt';
import { Engine } from './engine';
import { TestExecutionResult } from './test-result';

export interface StepContext {
  attempt: Attempt;
  engine: Engine;
}

export type Command = UIStep | CheckStep | AssertStep | DevStep | SayStep;

export interface CommandBody {
  execute(context: StepContext): TestExecutionResult;
  toString(): string;
}

export interface UIStep extends CommandBody {
  type: 'ui';
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

export interface SayStep extends CommandBody {
  type: 'say';
}