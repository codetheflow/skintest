import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { Query } from '../query';
import { asTest, TestExecutionResult } from '../test-result';

export class TypeStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    private query: Query<any>,
    private text: string) {
    Guard.notNull(text, 'text');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.type(selector, this.text));
  }

  toString() {
    return `I type ${this.text}`;
  }
}