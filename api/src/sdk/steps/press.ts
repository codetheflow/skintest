import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { KeyboardKey } from '../keyboard';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class PressStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<Meta>,
    private key: KeyboardKey
  ) {
    Guard.notNull(meta, 'meta');
    Guard.notEmpty(key, 'key');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.keyPress(this.key));
  }

  toString() {
    return `I press ${this.key}`;
  }
}