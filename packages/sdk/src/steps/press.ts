import { Guard } from '@skintest/common';
import { asTest, ClientStep, StepContext, StepExecutionResult } from '../command';
import { KeyboardKey } from '../keyboard';
import { StepMeta } from '../meta';

export class PressStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private key: KeyboardKey
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(key, 'key');
  }

  execute(context: StepContext): StepExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.keyPress(this.key));
  }

  toString(): string {
    return `I press ${this.key}`;
  }
}