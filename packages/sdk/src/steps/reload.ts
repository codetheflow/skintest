import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';

export class ReloadStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return methodResult(page.reload());
  }

  toString(): string {
    return 'reload';
  }
}