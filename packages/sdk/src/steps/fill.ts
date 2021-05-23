import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query } from '../query';
import { asTest, TestExecutionResult } from '../test-result';

export class FillStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query<any>,
    private value: string,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.fill(selector, this.value));
  }

  toString(): string {
    const selector = this.query.toString();
    return `I fill ${formatSelector(selector)} with \`${this.value}\``;
  }
}