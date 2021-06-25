import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';
import { stringify, Value } from '../value';

export class FillStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: Query,
    private value: Value<string, D>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    const text = materialize(this.value);
    return methodResult(page.fill(selector, text));
  }

  toString(): string {
    const selector = this.query.toString();
    return `fill ${formatSelector(selector)} with \`${stringify(this.value)}\``;
  }
}