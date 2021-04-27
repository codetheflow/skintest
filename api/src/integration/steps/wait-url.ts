import { Guard } from '../../common/guard';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class WaitUrlStep implements Step {
  constructor(
    private url: string
  ) {
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    return attempt(() => engine.waitForNavigation(this.url));
  }

  toString() {
    return `wait url ${this.url}`;
  }
}