import { Guard, reinterpret } from '@skintest/common';
import { AssertHost, BinaryAssert, ListBinaryAssert } from '../assert';
import { AssertStep, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query, QueryList } from '../query';
import { Verify } from '../verify';

export class SeeStep implements AssertStep {
  type: 'assert' = 'assert';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query | QueryList,
    private assert: BinaryAssert<unknown> | ListBinaryAssert<unknown>,
    private value: unknown
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
    Guard.notNull(assert, 'assert');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const verify = new Verify(page);
    const host = reinterpret<AssertHost>(this.assert);
    const result = await verify.theCondition(this.query, host, this.value);

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
      `I see ${method}(${selector}).${host.what}:` +
      `${host.no ? 'not' : ''} ` +
      `${host.how} \`${value}\``;

    return text;
  }
}