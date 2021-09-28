import { Guard, Meta } from '@skintest/common';
import { DevStep, methodResult, StepExecutionResult } from '../command';

export class PauseStep<D> implements DevStep<D> {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<Meta>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return '__pause';
  }
}