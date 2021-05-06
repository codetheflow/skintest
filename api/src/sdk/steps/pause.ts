import { DevStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor() { }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    return asTest(page.pause());
  }

  toString() {
    return 'I pause';
  }
}