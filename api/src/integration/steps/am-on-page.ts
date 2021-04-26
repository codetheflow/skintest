import { Guard } from '../../utils/guard';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class AmOnPageStep implements Step {
  constructor(
    private url: string
  ) {
    Guard.notNullOrEmpty(url, 'url');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;
    return attempt(() => engine.goto(this.url));
  }

  toString() {
    return `am on page ${this.url}`;
  }
}