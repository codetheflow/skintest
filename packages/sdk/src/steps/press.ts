import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { KeyboardKey } from '../keyboard';
import { stringify, Value } from '../value';

export class PressStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private key: Value<KeyboardKey, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(key, 'key');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const page = browser.getCurrentPage();
    const key = materialize(this.key);
    return methodResult(page.keyPress(key));
  }

  toString(): string {
    return `press ${stringify(this.key)}`;
  }
}