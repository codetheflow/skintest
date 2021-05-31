import { Guard } from '@skintest/common';
import { asTest, StepExecutionResult, TestStep } from '../command';
import { StepMeta } from '../meta';

export class ExecuteStep implements TestStep {
  type: 'test' = 'test';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private what: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): StepExecutionResult {
    return asTest(Promise.resolve());
  }

  toString(): string {
    return `I test ${this.what}`;
  }
}