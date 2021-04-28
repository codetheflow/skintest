import { Guard } from '../../common/guard';
import { formatSelector } from '../formatting';
import { Select } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class FocusStep implements Step {
  constructor(
    private selector: Select<any>,
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;
    return attempt(() => engine.focus(this.selector.query));
  }

  toString() {
    return `focus ${formatSelector(this.selector.query)}`;
  }
}
