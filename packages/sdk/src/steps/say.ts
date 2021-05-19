import { Guard } from '@skintest/common';
import { InfoStep, StepContext } from '../command';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class SayStep implements InfoStep {
  type: 'info' = 'info';

  constructor(
    public meta: Promise<Meta>,
    private message: string
  ) {
    Guard.notNull(meta, 'meta');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    return asTest(Promise.resolve());
  }

  toString() {
    return `I say ${this.message}`;
  }
}
