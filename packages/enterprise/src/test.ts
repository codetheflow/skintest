import { getCaller, getMeta, Meta, Serializable } from '@skintest/common';
import { Data, DataStep, StepExecutionResult } from '@skintest/sdk';

class CaseStep<D> implements DataStep<D> {
  type: 'data' = 'data';

  constructor(
    public getMeta: () => Promise<Meta>,
    private data: D[]
  ) { }

  async execute(): Promise<StepExecutionResult> {
    return {
      type: 'method',
    };
  }

  toString(): string {
    return `cases`;
  }
}

export const test = {
  cases<D extends Serializable>(...data: D[]): DataStep<D> {
    const caller = getCaller();
    const getStepMeta = () => getMeta(caller);
    return new CaseStep<D>(getStepMeta, data);
  },

  data<V, D, K extends keyof D>(key: K): D[K] extends V ? Data<V, D> : void {
    const result: Data<V, D> = {
      key,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
  },
};