import { Guard } from '@skintest/common';
import { asTest, ClientStep, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class WaitUrlStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private url: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): StepExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.waitForNavigation(this.url));
  }

  toString(): string {
    return `I wait url ${this.url}`;
  }
}