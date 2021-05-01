import { CheckStep, StepContext } from '../command';
import { pass, TestExecutionResult } from '../test-result';

export class CheckWhatStep implements CheckStep {
  type: 'check' = 'check';

  constructor(private what: string) {
  }

  execute(context: StepContext): TestExecutionResult {
    return Promise.resolve(pass());
  }

  toString() {
    return `I check ${this.what}`;
  }
}
