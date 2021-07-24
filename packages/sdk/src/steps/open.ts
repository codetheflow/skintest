import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { stringify, Value } from '../value';

export class OpenStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private name: Value<string, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(name, 'name');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const name = materialize(this.name);
    return methodResult(browser.openTab(name));
  }

  toString(): string {
    return `open ${stringify(this.name)}`;
  }
}