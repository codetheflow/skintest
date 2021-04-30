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

    const query = this.selector.toString();
    return attempt(() => engine.attachFile(query, this.file));
  }

  toString() {
    const query = this.selector.toString();
    return `attach file \`${this.file}\` to ${formatSelector(query)}`
  }
}
