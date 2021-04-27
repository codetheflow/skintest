import { Guard } from '../../common/guard';
import { Select } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class DoStep implements Step {
  constructor(
    private action: (...args: any) => TestExecutionResult,
    private args: any[]
  ) {
    Guard.notNull(action, 'action');
  }

  execute(context: StepContext): TestExecutionResult {
    return this.action(...this.args);
  }

  toString() {
    return `do`;
  }
}
