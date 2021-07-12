import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';
import { stringify, Value } from '../value';

export class MarkStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: Query,
    private value: Value<'checked' | 'unchecked', D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const page = browser.getCurrentPage();
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
    return `mark ${formatSelector(selector)} as ${stringify(this.value)}`;
  }
}