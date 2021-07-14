import { Guard, Meta } from '@skintest/common';
import { ClientStep, StepExecutionResult } from '../command';
import { Steps } from '../script';

export class EventStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private handler: Steps,
    private trigger: Steps,
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