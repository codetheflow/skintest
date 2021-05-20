import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { StepMeta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class ReloadStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<StepMeta>,
  ) {
    Guard.notNull(meta, 'meta');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.reload());
  }

  toString(): string {
    return `I reload`;
  }
}