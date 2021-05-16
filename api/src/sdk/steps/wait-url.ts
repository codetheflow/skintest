import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class WaitUrlStep implements ClientStep {
  type: 'client' = 'client';

  constructor(private url: string) {
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.waitForNavigation(this.url));
  }

  toString() {
    return `I wait url ${this.url}`;
  }
}