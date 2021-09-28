import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult, stringifyValue, Value } from '@skintest/sdk';
import { Browser } from '../browser';

export class NavigationStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private browser: Browser,
    private direction: Value<'forward' | 'back', D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(direction, 'direction');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { materialize } = context;

    const page = this.browser.getCurrentPage();
    const direction = materialize(this.direction);
    return methodResult(
      direction === 'back'
        ? page.goBack()
        : page.goForward()
    );
  }

  toString(): string {
    return `go ${stringifyValue(this.direction)}`;
  }
}