import { Guard } from '../../common/guard';
import { KeyboardKey } from '../keyboard';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class PressStep implements UIStep {
  type: 'ui' = 'ui';

  constructor(private key: KeyboardKey) {
    Guard.notEmpty(key, 'key');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    return attempt(() => engine.press(this.key));
  }

  toString() {
    return `press ${this.key}`;
  }
}