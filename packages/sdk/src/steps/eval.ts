import { Data, Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';

export class EvalStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private message: string,
    private pageFunction: (arg: Data) => void,
    private arg: Data,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(message, 'message');
    Guard.notNull(pageFunction, 'pageFunction');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;
    const page = browser.getCurrentPage();
    
    return methodResult(page.evaluate(this.pageFunction, this.arg));
  }

  toString(): string {
    return `perform ${this.message}`;
  }
}