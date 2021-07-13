import { Guard, Meta, qte, reinterpret } from '@skintest/common';
import { AssertHost, BinaryAssert, ListBinaryAssert } from '../assert';
import { AssertStep, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { Query, QueryList } from '../query';
import { stringify, Value } from '../value';
import { Verify } from '../verify';

export class SeeStep<D> implements AssertStep<D> {
  type: 'assert' = 'assert';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: Query | QueryList,
    private assert: BinaryAssert<unknown> | ListBinaryAssert<unknown>,
    private value: Value<unknown, D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
    Guard.notNull(assert, 'assert');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser, materialize } = context;

    const page = browser.getCurrentPage();
    const verify = new Verify(page);
    const host = reinterpret<AssertHost>(this.assert);
    const value = materialize(this.value);
    const result = await verify.theCondition(this.query, host, value);

    return {
      type: 'assert',
      result
    };
  }

  toString(): string {
    const { query, assert, value } = this;
    const host = reinterpret<AssertHost>(assert);
    const selector = formatSelector(query.toString());
    const method = query.type === 'query' ? '$' : '$$';

    const text =
      `see ${method}(${selector}).${host.what}:` +
      `${host.no ? 'not' : ''} ` +
      `${host.how} ${qte(stringify(value))}`;

    return text;
  }
}