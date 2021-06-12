import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
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

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
  return methodResult(page.keyPress(this.key));
  }

  toString(): string {
    return `press ${this.key}`;
  }
}