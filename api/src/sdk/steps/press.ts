import { Guard } from '../../common/guard';
import { KeyboardKey } from '../keyboard';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class PressStep implements ClientStep {
  type: 'client' = 'client';

  constructor(private key: KeyboardKey) {
    Guard.notEmpty(key, 'key');
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    return asTest(page.keyPress(this.key));
  }

  toString() {
    return `I press ${this.key}`;
  }
}