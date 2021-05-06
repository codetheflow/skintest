import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class GoForwardStep implements ClientStep {
  type: 'client' = 'client';

  constructor() {
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    return asTest(page.goForward());
  }

  toString() {
    return `I go forward`;
  }
}