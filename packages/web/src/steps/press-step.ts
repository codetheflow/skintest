import { Guard, Meta } from '@skintest/common';
import { ClientStep, KeyboardKey, methodResult, StepContext, StepExecutionResult, stringifyValue, Value } from '@skintest/sdk';
import { Browser } from '../browser';

export class PressStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private key: Value<KeyboardKey, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(key, 'key');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;

    const page = this.browser.getCurrentPage();
    const key = materialize(this.key);
    return methodResult(page.keyPress(key));
  }

  toString(): string {
    return `press ${stringifyValue(this.key)}`;
  }
}