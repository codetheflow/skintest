import { InfoStep, StepContext } from '../command';
import { pass, TestExecutionResult } from '../test-result';

export class SayStep implements InfoStep {
  type: 'info' = 'info';

  constructor(private message: string) { }

  execute(context: StepContext): TestExecutionResult {
    return Promise.resolve(pass());
  }

  toString() {
    return `I say ${this.message}`;
  }
}
