import { Guard } from '../../common/guard';
import { formatSelector } from '../format';
import { Query } from '../query';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class FillStep implements UIStep {
  type: 'ui' = 'ui';

  constructor(
    private query: Query<any>,
    private value: string,
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;
    
    const selector = this.query.toString();
    return attempt(() => engine.fill(selector, this.value));
  }

  toString() {
    const selector = this.query.toString();
    return `I fill ${formatSelector(selector)} with \`${this.value}\``;
  }
}
