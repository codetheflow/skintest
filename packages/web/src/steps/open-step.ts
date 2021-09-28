import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult, stringifyValue, Value } from '@skintest/sdk';
import { Browser } from '../browser';

export class OpenStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private name: Value<string, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(name, 'name');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;

    const name = materialize(this.name);
    return methodResult(this.browser.openPage(name));
  }

  toString(): string {
    return `open ${stringifyValue(this.name)}`;
  }
}