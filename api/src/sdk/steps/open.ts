import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class OpenStep implements ClientStep {
  type: 'client' = 'client';

  constructor(private id: string) {
    Guard.notEmpty(id, 'id');
  }

  execute(context: StepContext): TestExecutionResult {
    const { browser } = context;

    return asTest(browser.openPage(this.id));
  }

  toString() {
    return `I open ${this.id}`;
  }
}