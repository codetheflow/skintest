import { TestStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class StartTestStep implements TestStep {
  type: 'test' = 'test';

  constructor(private what: string) {
  }

  execute(context: StepContext): TestExecutionResult {
    return asTest(Promise.resolve());
  }

  toString() {
    return `I test ${this.what}`;
  }
}
