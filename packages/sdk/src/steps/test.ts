import { Guard } from '@skintest/common';
import { TestStep } from '../command';
import { StepMeta } from '../meta';
import { asTest, TestExecutionResult } from '../test-result';

export class ExecuteStep implements TestStep {
  type: 'test' = 'test';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private what: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<TestExecutionResult> {
    return asTest(Promise.resolve());
  }

  toString(): string {
    return `I test ${this.what}`;
  }
}