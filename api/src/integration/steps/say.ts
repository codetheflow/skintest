import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class SayStep implements Step {
  constructor(
    private message: string
  ) { }

  execute(context: StepContext): TestExecutionResult {
    return Promise.resolve(null);
  }

  toString() {
    return `say ${this.message}`;
  }
}
