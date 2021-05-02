import { Guard } from '../../common/guard';
import { formatSelector } from '../format';
import { Query } from '../query';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class ClickStep implements UIStep {
  type: 'ui' = 'ui';
  
  constructor(
    private query: Query<any>
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    const query = this.query.toString();
    return attempt(() => engine.click(query));
  }

  toString() {
    const query = this.query.toString();
    return `I click ${formatSelector(query)}`;
  }
}
