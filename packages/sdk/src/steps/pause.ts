import { Guard } from '@skintest/common';
import { DevStep, StepContext } from '../command';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public meta: Promise<Meta>,
  ) {
    Guard.notNull(meta, 'meta');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.pause());
  }

  toString() {
    return '__pause';
  }
}