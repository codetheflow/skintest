import { Guard, Meta, qte } from '@skintest/common';
import { ClientStep, methodResult, Query, StepContext, StepExecutionResult, stringifyValue, Value } from '@skintest/sdk';
import { Browser } from '../browser';
import { formatSelector } from '../format';

export class FillStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private query: Query,
    private value: Value<string, D>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;
    const page = this.browser.getCurrentPage();
    const selector = this.query.toString();
    const text = materialize(this.value);
    
    return methodResult(page.fill(selector, text));
  }

  toString(): string {
    const selector = this.query.toString();
    return `fill ${formatSelector(selector)} with ${qte(stringifyValue(this.value))}`;
  }
}