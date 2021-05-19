import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class FocusStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<Meta>,
    private query: Query<any>
  ) {
    Guard.notNull(meta, 'meta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.focus(selector));
  }

  toString() {
    const selector = this.query.toString();
    return `I focus ${formatSelector(selector)}`;
  }
}
