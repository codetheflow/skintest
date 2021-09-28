import { Data, Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepExecutionResult } from '@skintest/sdk';
import { Browser } from '../browser';

export class EvaluateStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private pageFunction: (arg: Data) => void,
    private arg: Data,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(pageFunction, 'pageFunction');
  }

  async execute(): Promise<StepExecutionResult> {
    const page = this.browser.getCurrentPage();
    
    return methodResult(page.evaluate(this.pageFunction, this.arg));
  }

  toString(): string {
    return 'evaluate';
  }
}