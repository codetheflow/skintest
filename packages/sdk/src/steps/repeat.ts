import { Guard } from '@skintest/common';
import { ClientStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { ConditionSchema } from '../schema';

export class RepeatStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private plan: ConditionSchema,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(plan, 'plan');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'repeat',
      plan: this.plan
    };
  }

  toString(): string {
    return `repeat`;
  }
}