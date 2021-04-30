import { Guard } from '../../common/guard';
import { formatSelector } from '../formatting';
import { Select } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class ClickStep implements Step {
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
    return `click ${formatSelector(query)}`;
  }
}
