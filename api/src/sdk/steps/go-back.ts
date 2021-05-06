import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class GoBackStep implements ClientStep {
  type: 'client' = 'client';

  constructor() {
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    return asTest(page.goBack());
  }

  toString() {
    return `I go back`;
  }
}