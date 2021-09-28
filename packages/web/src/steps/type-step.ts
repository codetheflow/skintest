import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, Query, StepContext, StepExecutionResult, Value } from '@skintest/sdk';
import { Browser } from '../browser';

export class TypeStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private query: Query,
    private value: Value<string, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(value, 'value');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;

    const page = this.browser.getCurrentPage();
    const selector = this.query.toString();
    const text = materialize(this.value);
    return methodResult(page.type(selector, text));
  }

  toString(): string {
    return `type ${this.value}`;
  }
}