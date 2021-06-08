import { Guard } from '@skintest/common';
import { ClientStep, Command, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { StorySchema } from '../schema';

export class WaitStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    public waiter: Command,
    public trigger: StorySchema,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(waiter, 'event');
    Guard.notNull(trigger, 'trigger');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'wait',
      waiter: this.waiter,
      trigger: this.trigger,
    };
  }

  toString(): string {
    return `I wait...`;
  }
}