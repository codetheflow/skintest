import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class WaitNavigationStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private url: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return methodResult(page.waitForNavigation(this.url));
  }

  toString(): string {
    return `wait url ${this.url}`;
  }
}