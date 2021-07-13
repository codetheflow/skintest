import { Guard, Meta } from '@skintest/common';
import { AssertStep, StepExecutionResult } from '../command';
import { ThatFunction } from '../that';

export class ThatStep<D> implements AssertStep<D> {
  type: 'assert' = 'assert';

  constructor(
    public getMeta: () => Promise<Meta>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public task: ThatFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(task, 'task');
    Guard.notNull(args, 'args');
  }

  async execute(): Promise<StepExecutionResult> {
    const result = await this.task(...this.args);

    return {
      type: 'assert',
      result,
    };
  }

  toString(): string {
    return 'that';
  }
}