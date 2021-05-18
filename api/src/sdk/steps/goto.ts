import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class GotoStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<Meta>,
    private url: string
  ) {
    Guard.notNull(meta, 'meta');
    Guard.notEmpty(url, 'url');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.goto(this.url));
  }

  toString() {
    return `I go to ${this.url}`;
  }
}