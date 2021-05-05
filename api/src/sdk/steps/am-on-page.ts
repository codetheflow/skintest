import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class AmOnPageStep implements ClientStep {
  type: 'client' = 'client';
  
  constructor(
    private url: string
  ) {
    Guard.notEmpty(url, 'url');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, driver } = context;
    return attempt(() => driver.goto(this.url));
  }

  toString() {
    return `I am on page ${this.url}`;
  }
}