import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { KeyboardKey } from '../keyboard';
import { StepMeta } from '../meta';
import { asTest, TestExecutionResult } from '../test-result';

export class PressStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<StepMeta>,
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

  toString(): string {
    return `I press ${this.key}`;
  }
}