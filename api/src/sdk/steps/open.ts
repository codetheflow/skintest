import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class OpenStep implements ClientStep {
  type: 'client' = 'client';

  constructor(private name: string) {
    Guard.notEmpty(name, 'name');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    return asTest(browser.openPage(this.name));
  }

  toString() {
    return `I open ${this.name}`;
  }
}