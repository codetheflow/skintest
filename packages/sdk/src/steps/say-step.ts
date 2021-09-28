import { Guard, Meta } from '@skintest/common';
import { InfoStep, methodResult, StepExecutionResult } from '../command';
import { stringifyValue, Value } from '../value';

export class SayStep<D> implements InfoStep<D> {
  type: 'info' = 'info';

  constructor(
    public getMeta: () => Promise<Meta>,
    private message: Value<string, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(): Promise<StepExecutionResult> {
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return `say ${stringifyValue(this.message)}`;
  }
}