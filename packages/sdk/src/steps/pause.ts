import { Guard } from '@skintest/common';
import { DevStep, StepContext } from '../command';
import { StepMeta } from '../meta';
import { asTest, TestExecutionResult } from '../test-result';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.pause());
  }

  toString(): string {
    return '__pause';
  }
}