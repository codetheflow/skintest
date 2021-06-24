import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { Query } from '../query';

export class TypeStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: Query,
    private text: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(text, 'text');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return methodResult(page.type(selector, this.text));
  }

  toString(): string {
    return `type ${this.text}`;
  }
}