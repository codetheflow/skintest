import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { Query } from '../query';
import { Value } from '../value';

export class TypeStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: Query,
    private value: Value<string, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(value, 'value');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    const text = materialize(this.value);
    return methodResult(page.type(selector, text));
  }

  toString(): string {
    return `type ${this.value}`;
  }
}