import { Guard } from '../../common/guard';
import { Select } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';
import { formatSelector } from '../formatting';

export class AttachFileStep implements Step {
  constructor(
    private selector: Select<any>,
    private file: any,
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;
    return attempt(() => engine.attachFile(this.selector.query, this.file));
  }

  toString() {
    return `attach file "${this.file}" to ${formatSelector(this.selector.query)}`
  }
}
