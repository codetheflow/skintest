import { Guard } from '@skintest/common';
import { DevStep } from '../command';
import { StepMeta } from '../meta';
import { pass, TestExecutionResult } from '../test-result';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  async execute(): Promise<TestExecutionResult> {
    return pass();
  }

  toString(): string {
    return '__pause';
  }
}