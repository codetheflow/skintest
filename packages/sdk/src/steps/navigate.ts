import { Guard, Meta } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { stringify, Value } from '../value';

export class NavigationStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private direction: Value<'forward' | 'back', D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(direction, 'direction');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const page = browser.getCurrentPage();
    const direction = materialize(this.direction);
    return methodResult(
      direction === 'back'
        ? page.goBack()
        : page.goForward()
    );
  }

  toString(): string {
    return `go ${stringify(this.direction)}`;
  }
}