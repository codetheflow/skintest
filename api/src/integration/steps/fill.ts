import { Guard } from '../../common/guard';
import { formatSelector } from '../formatting';
import { Select } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class FillStep implements Step {
  constructor(
    private selector: Select<any>,
    private value: string,
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    const query = this.selector.toString();
    return attempt(() => engine.fill(query, this.value));
  }

  toString() {
    const query = this.selector.toString();
    return `fill ${formatSelector(query)} with "${this.value}"`;
  }
}
