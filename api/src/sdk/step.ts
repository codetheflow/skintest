import { Attempt } from './attempt';
import { Engine } from './engine';
import { TestExecutionResult } from './test-result';

export interface StepContext {
  attempt: Attempt;
  engine: Engine;
}

export interface Step {
  execute(context: StepContext): TestExecutionResult;
  toString(): string;
}
