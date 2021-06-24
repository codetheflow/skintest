import { Guard, Meta } from '@skintest/common';
import { InfoStep, methodResult, StepExecutionResult } from '../command';

export class SayStep<D> implements InfoStep<D> {
  type: 'info' = 'info';

  constructor(
    public getMeta: () => Promise<Meta>,
    private message: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return `say ${this.message}`;
  }
}