import { Guard } from '@skintest/common';
import { asTest, DevStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): StepExecutionResult {
    return asTest(Promise.resolve());
  }

  toString(): string {
    return '__pause';
  }
}