import { Step, StepContext } from '../step';
import { pass, TestExecutionResult } from '../test-result';

export class SayStep implements Step {
  constructor(
    private message: string
  ) { }

  execute(context: StepContext): TestExecutionResult {
    return Promise.resolve(pass());
  }

  toString() {
    return `say ${this.message}`;
  }
}
