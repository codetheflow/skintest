import { Guard, Meta } from '@skintest/common';
import { ClientStep, Command, StepExecutionResult } from '../command';

export class EventStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private handler: Command,
    private trigger: Command[],
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(handler, 'handler');
    Guard.notNull(trigger, 'trigger');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'event',
      handler: this.handler,
      trigger: this.trigger,
    };
  }

  toString(): string {
    return `event ${this.handler.toString()}`;
  }
}