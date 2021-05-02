import { Guard } from '../../common/guard';
import { formatSelector } from '../format';
import { Query } from '../query';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class FocusStep implements UIStep {
  type: 'ui' = 'ui';

  constructor(
    private query: Query<any>
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    const selector = this.query.toString();
    return attempt(() => engine.focus(selector));
  }

  toString() {
    const selector = this.query.toString();
    return `I focus ${formatSelector(selector)}`;
  }
}
