import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';

export class OpenStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private name: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(name, 'name');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    return methodResult(browser.openPage(this.name));
  }

  toString(): string {
    return `open ${this.name}`;
  }
}