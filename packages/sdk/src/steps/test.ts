import { Guard } from '@skintest/common';
import { methodResult, StepExecutionResult, TestStep } from '../command';
import { StepMeta } from '../meta';

export class ExecuteStep implements TestStep {
  type: 'test' = 'test';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private what: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return `test ${this.what}`;
  }
}