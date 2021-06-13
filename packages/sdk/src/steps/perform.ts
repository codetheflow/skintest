import { errors, Guard } from '@skintest/common';
import { ClientStep, DoStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { RepeatYield } from '../repeat';
import { PerformSchema } from '../schema';
import { IIfStep } from './iif';
import { TillStep } from './till';

export class PerformStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private message: string,
    private plan: PerformSchema,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(plan, 'plan');
  }

  async execute(): Promise<StepExecutionResult> {
    const { plan } = this;

    const index = plan.findIndex(x => x.type === 'control');
    if (index >= 0) {
      const marker = plan[index];
      if (marker instanceof IIfStep) {
        return {
          type: 'condition',
          cause: plan.slice(index, plan.length),
          plan: plan.slice(0, index),
        };
      }

      if (marker instanceof TillStep) {
        const writes: RepeatYield[] = plan
        .filter(x => x.type === 'do')
        .map(x => (x as DoStep).args)
        .reduce((xs, memo) => {
          memo.push(...xs);
          return memo;
        }, [])
        .filter(x => x instanceof RepeatYield);

        return {
          type: 'repeat',
          till: plan.slice(index, plan.length),
          plan: plan.slice(0, index),
          writes
        };
      }

      throw errors.invalidArgument('control', marker.toString());
    }

    return {
      type: 'perform',
      plan,
    };
  }

  toString(): string {
    return `perform ${this.message}`;
  }
}