import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';

export class GotoStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private url: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(url, 'url');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return methodResult(page.goto(this.url));
  }

  toString(): string {
    return `go to ${this.url}`;
  }
}