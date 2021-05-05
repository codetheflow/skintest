import { DevStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class PauseStep implements DevStep {
  type: 'dev' = 'dev';

  constructor() { }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, driver } = context;

    return attempt(() => driver.pause());
  }

  toString() {
    return 'I pause';
  }
}