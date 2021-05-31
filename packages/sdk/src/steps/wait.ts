import { Guard } from '@skintest/common';
import { ClientStep, Command, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { pass } from '../test-result';

export class WaitStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    public waiter: Command[],
    public trigger: Command[],
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(waiter, 'event');
    Guard.notNull(trigger, 'trigger');
  }

  async execute(): StepExecutionResult {
    return {
      result: pass(),
      plans: [
        this.waiter,
        this.trigger,
      ],
    };
  }

  toString(): string {
    return `I wait...`;
  }
}