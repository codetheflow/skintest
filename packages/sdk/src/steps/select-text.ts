import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';
import { StepMeta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class SelectTextStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<StepMeta>,
    private query: Query<any>
  ) {
    Guard.notNull(meta, 'meta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.selectText(selector));
  }

  toString(): string {
    const selector = this.query.toString();
    return `I select ${formatSelector(selector)}`;
  }
}