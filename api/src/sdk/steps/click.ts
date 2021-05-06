import { Guard } from '../../common/guard';
import { formatSelector } from '../format';
import { Query } from '../query';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class ClickStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    private query: Query<any>
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    const selector = this.query.toString();
    // todo: move attempt to the scene level
    return asTest(page.click(selector));
  }

  toString() {
    const selector = this.query.toString();
    return `I click ${formatSelector(selector)}`;
  }
}
