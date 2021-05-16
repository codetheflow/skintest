import { StepContext, TestStep } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class StartTestStep implements TestStep {
  type: 'test' = 'test';

  constructor(private what: string) {
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    return asTest(Promise.resolve());
  }

  toString() {
    return `I test ${this.what}`;
  }
}
