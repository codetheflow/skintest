import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { StepMeta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class WaitUrlStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<StepMeta>,
    private url: string
  ) {
    Guard.notNull(meta, 'meta');
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.waitForNavigation(this.url));
  }

  toString(): string {
    return `I wait url ${this.url}`;
  }
}