import { Guard, Meta } from '@skintest/common';
import { ClientStep, Step, StepExecutionResult, Steps } from '@skintest/sdk';

export class EventStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private trigger: Steps,
    private handler: Step,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(trigger, 'trigger');
    Guard.notNull(handler, 'handler');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'event',
      trigger: this.trigger,
      handler: [this.handler],
    };
  }

  toString(): string {
    return `event ${this.handler.toString()}`;
  }
}