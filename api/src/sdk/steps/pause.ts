import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class PauseStep implements Step {
  constructor() { }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    return attempt(() => engine.pause());
  }

  toString() {
    return 'pause';
  }
}