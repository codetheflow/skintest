import { Guard } from '@skintest/common';
import { asTest, ClientStep, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query } from '../query';

export class MarkStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query,
    private value: 'checked' | 'unchecked'
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): StepExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(
      this.value === 'checked'
        ? page.check(selector)
        : page.uncheck(selector)
    );
  }

  toString(): string {
    const selector = this.query.toString();
    return `I mark ${formatSelector(selector)} as ${this.value}`;
  }
}