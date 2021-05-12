import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class NavigationForwardStep implements ClientStep {
  type: 'client' = 'client';

  constructor() {
  }

  execute(context: StepContext): TestExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.goForward());
  }

  toString() {
    return `I go forward`;
  }
}