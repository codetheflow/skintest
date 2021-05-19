import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class NavigationForwardStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<Meta>,
  ) {
    Guard.notNull(meta, 'meta');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.goForward());
  }

  toString() {
    return `I go forward`;
  }
}