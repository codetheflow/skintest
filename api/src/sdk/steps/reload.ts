import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class ReloadStep implements ClientStep {
  type: 'client' = 'client';

  constructor() {
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    return asTest(page.reload());
  }

  toString() {
    return `I reload`;
  }
}