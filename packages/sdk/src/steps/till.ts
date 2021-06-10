import { Guard } from '@skintest/common';
import { ControlStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class TillStep implements ControlStep {
  type: 'control' = 'control';

  constructor(
    public getMeta: () => Promise<StepMeta>,
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