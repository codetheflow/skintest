import { Guard, Meta } from '@skintest/common';
import { AssertStep, StepContext, StepExecutionResult } from '../command';
import { Value } from '../value';
import { Assert } from '../verify/assert';

export class SeeStep<D> implements AssertStep<D> {
  type: 'assert' = 'assert';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: unknown,
    private assert: Assert<unknown, unknown>,
    private value: Value<unknown, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
    Guard.notNull(assert, 'assert');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { assert, value, query } = this;
    const { materialize } = context;

    const received = materialize(value);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expected = await assert.what.select(query);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await assert.how.test(expected, received);

    return {
      type: 'assert',
      result
    };
  }

  toString(): string {
    // const { query, assert, value } = this;
    // const host = reinterpret<AssertHost>(assert);
    // const selector = query.toString();
    // const method = query.type === 'query' ? '$' : '$$';

    // const text =
    //   `see ${method}(${selector}).${host.what}:` +
    //   `${host.no ? 'not' : ''} ` +
    //   `${host.how} ${qte(stringifyValue(value))}`;

    return 'see';
  }
}