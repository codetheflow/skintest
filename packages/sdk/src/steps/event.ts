import { Guard } from '@skintest/common';
import { ClientStep, Command, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class EventStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
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
    return `I wait...`;
  }
}