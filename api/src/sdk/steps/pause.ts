import { DevStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor() { }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.pause());
  }

  toString() {
    return 'I pause';
  }
}