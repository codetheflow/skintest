import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, Query, StepContext, StepExecutionResult, stringifyValue, Value } from '@skintest/sdk';
import { Browser } from '../browser';
import { formatSelector } from '../format';

export class MarkStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private query: Query,
    private value: Value<'checked' | 'unchecked', D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;

    const page = this.browser.getCurrentPage();
    const selector = this.query.toString();
    const value = materialize(this.value);
    return methodResult(
      value === 'checked'
        ? page.check(selector)
        : page.uncheck(selector)
    );
  }

  toString(): string {
    const selector = this.query.toString();
    return `mark ${formatSelector(selector)} as ${stringifyValue(this.value)}`;
  }
}