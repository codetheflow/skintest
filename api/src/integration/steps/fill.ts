import { Guard } from '../../common/guard';
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
    return attempt(() => engine.fill(this.selector.query, this.value));
  }

  toString() {
    return `fill ${this.selector.query} with "${this.value}"`;
  }
}