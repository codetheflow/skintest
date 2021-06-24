import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';

export class MarkStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: Query,
    private value: 'checked' | 'unchecked'
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return methodResult(
      this.value === 'checked'
        ? page.check(selector)
        : page.uncheck(selector)
    );
  }

  toString(): string {
    const selector = this.query.toString();
    return `mark ${formatSelector(selector)} as ${this.value}`;
  }
}