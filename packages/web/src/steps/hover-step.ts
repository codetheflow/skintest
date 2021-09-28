import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, Query, StepExecutionResult } from '@skintest/sdk';
import { Browser } from '../browser';
import { formatSelector } from '../format';

export class HoverStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private query: Query,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(): Promise<StepExecutionResult> {
    const page = this.browser.getCurrentPage();
    const selector = this.query.toString();
    return methodResult(page.hover(selector));
  }

  toString(): string {
    const selector = this.query.toString();
    return `hover ${formatSelector(selector)}`;
  }
}