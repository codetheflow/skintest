import { Guard, Meta } from '@skintest/common';
import { CheckStep, methodResult, StepExecutionResult } from '../command';

export class CheckExecuteStep<D> implements CheckStep<D> {
  type: 'check' = 'check';

  constructor(
    public getMeta: () => Promise<Meta>,
    private what: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return `check ${this.what}`;
  }
}