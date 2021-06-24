import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { KeyboardKey } from '../keyboard';

export class PressStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
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