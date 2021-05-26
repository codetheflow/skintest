import { Guard } from '@skintest/common';
import { InfoStep } from '../command';
import { StepMeta } from '../meta';
import { asTest, TestExecutionResult } from '../test-result';

export class SayStep implements InfoStep {
  type: 'info' = 'info';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private message: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<TestExecutionResult> {
    return asTest(Promise.resolve());
  }

  toString(): string {
    return `I say ${this.message}`;
  }
}