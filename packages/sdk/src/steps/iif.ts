import { Guard } from '@skintest/common';
import { ClientStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { ConditionSchema } from '../schema';

export class IIfStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private message: string,
    private plan: ConditionSchema,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(plan, 'plan');
  }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'condition',
      plan: this.plan
    };
  }

  toString(): string {
    return `if ${this.message}`;
  }
}