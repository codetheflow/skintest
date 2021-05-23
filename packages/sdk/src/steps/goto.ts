import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { StepMeta } from '../meta';
import { asTest, TestExecutionResult } from '../test-result';

export class GotoStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private url: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(url, 'url');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.goto(this.url));
  }

  toString(): string {
    return `I go to ${this.url}`;
  }
}