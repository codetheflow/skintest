import { Guard } from '../../utils/guard';
import { KeyboardKey } from '../keyboard';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class PressStep implements Step {
  constructor(
    private key: KeyboardKey
  ) {
    Guard.notNullOrEmpty(key, 'key');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    return attempt(() => engine.press(this.key));
  }

  toString() {
    return `press ${this.key}`;
  }
}