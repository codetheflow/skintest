import { Guard } from '@skintest/common';
import { InfoStep, methodResult, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class SayStep implements InfoStep {
  type: 'info' = 'info';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private message: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return `I say ${this.message}`;
  }
}