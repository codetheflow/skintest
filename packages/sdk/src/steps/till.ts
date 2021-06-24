import { Guard, Meta } from '@skintest/common';
import { ControlStep, StepExecutionResult } from '../command';

export class TillStep<D> implements ControlStep<D> {
  type: 'control' = 'control';

  constructor(
    public getMeta: () => Promise<Meta>,
    private message: string,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(message, 'message');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'method',
    };
  }

  toString(): string {
    return `till ${this.message}`;
  }
}