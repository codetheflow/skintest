import { SayStep, StepContext } from '../command';
import { pass, TestExecutionResult } from '../test-result';

export class TalkStep implements SayStep {
  type: 'say' = 'say';

  constructor(private message: string) { }

  execute(context: StepContext): TestExecutionResult {
    return Promise.resolve(pass());
  }

  toString() {
    return `say ${this.message}`;
  }
}
