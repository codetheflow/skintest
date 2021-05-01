import { Guard } from '../../common/guard';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class DoStep implements UIStep {
  type: 'ui' = 'ui';

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
