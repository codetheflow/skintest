import { Guard } from '../../common/guard';
import { formatSelector } from '../formatting';
import { Select } from '../selector';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class ClickStep implements UIStep {
  type: 'ui' = 'ui';
  
  constructor(
    private selector: Select<any>
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    const query = this.selector.toString();
    return attempt(() => engine.click(query));
  }

  toString() {
    const query = this.selector.toString();
    return `I click ${formatSelector(query)}`;
  }
}
