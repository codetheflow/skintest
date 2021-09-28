import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult, Value } from '@skintest/sdk';
import { Browser } from '../browser';

export class WaitNavigationStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private url: Value<string, D>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;

    const page = this.browser.getCurrentPage();
    const url = materialize(this.url);
    return methodResult(page.waitForNavigation(url));
  }

  toString(): string {
    return 'wait url';
  }
}