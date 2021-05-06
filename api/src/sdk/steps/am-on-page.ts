import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class AmOnPageStep implements ClientStep {
  type: 'client' = 'client';
  
  constructor(
    private url: string
  ) {
    Guard.notEmpty(url, 'url');
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;
    return asTest(page.goto(this.url));
  }

  toString() {
    return `I am on page ${this.url}`;
  }
}