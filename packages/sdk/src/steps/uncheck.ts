import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query } from '../query';
import { asTest, TestExecutionResult } from '../test-result';

export class UncheckStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query<any>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.uncheck(selector));
  }

  toString(): string {
    const selector = this.query.toString();
    return `I uncheck ${formatSelector(selector)}`;
  }
}