import { Guard } from '@skintest/common';
import { DevStep, methodResult, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
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