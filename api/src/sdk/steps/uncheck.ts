import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';
import { asTest, TestExecutionResult } from '../test-result';

export class UncheckStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    private query: Query<any>
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.uncheck(selector));
  }

  toString() {
    const selector = this.query.toString();
    return `I uncheck ${formatSelector(selector)}`;
  }
}
