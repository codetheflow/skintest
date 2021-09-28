import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepExecutionResult } from '@skintest/sdk';
import { Browser } from '../browser';

export class ReloadStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    const page = this.browser.getCurrentPage();
    return methodResult(page.reload());
  }

  toString(): string {
    return 'reload';
  }
}