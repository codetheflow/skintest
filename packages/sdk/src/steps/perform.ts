import { Guard } from '@skintest/common';
import { ClientStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { StorySchema } from '../schema';

export class PerformStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private message: string,
    private plan: StorySchema,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(plan, 'plan');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'perform',
      plan: this.plan,
    };
  }

  toString(): string {
    return this.message;
  }
}