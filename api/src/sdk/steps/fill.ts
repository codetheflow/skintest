import { Guard } from '../../common/guard';
import { formatSelector } from '../format';
import { Query } from '../query';
import { ClientStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class FillStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    private query: Query<any>,
    private value: string,
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const {  attempt, driver } = context;
    
    const selector = this.query.toString();
    return attempt(() => driver.fill(selector, this.value));
  }

  toString() {
    const selector = this.query.toString();
    return `I fill ${formatSelector(selector)} with \`${this.value}\``;
  }
}
