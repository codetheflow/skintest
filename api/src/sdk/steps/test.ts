import { Guard } from '../../common/guard';
import { StepContext, TestStep } from '../command';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class ExecuteStep implements TestStep {
  type: 'test' = 'test';

  constructor(
    public meta: Promise<Meta>,
    private what: string
  ) {
    Guard.notNull(meta, 'meta');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    return asTest(Promise.resolve());
  }

  toString() {
    return `I test ${this.what}`;
  }
}
