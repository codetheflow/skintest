import { Guard, Indexed, Meta } from '@skintest/common';
import { DoStep, StepExecutionResult } from '../command';
import { TaskFunction } from '../task';

export class TaskStep<D> implements DoStep<D> {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<Meta>,
    public task: TaskFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(task, 'task');
    Guard.notNull(args, 'args');
  }

  async execute(): Promise<StepExecutionResult> {
    const op = await this.task(...this.args);
    const plan = op(undefined);

    return {
      type: 'task',
      body: new Indexed(Array.from(plan)),
    };
  }

  toString(): string {
    return 'task';
  }
}