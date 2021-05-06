import { InfoStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class SayStep implements InfoStep {
  type: 'info' = 'info';

  constructor(private message: string) { }

  execute(context: StepContext): TestExecutionResult {
    return asTest(Promise.resolve());
  }

  toString() {
    return `I say ${this.message}`;
  }
}
