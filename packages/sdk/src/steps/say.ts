import { Guard } from '@skintest/common';
import { asTest, InfoStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class SayStep implements InfoStep {
  type: 'info' = 'info';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private message: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): StepExecutionResult {
    return asTest(Promise.resolve());
  }

  toString(): string {
    return `I say ${this.message}`;
  }
}