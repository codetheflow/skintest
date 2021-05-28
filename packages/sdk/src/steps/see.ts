import { Guard, isUndefined, reinterpret } from '@skintest/common';
import { AssertHost, BinaryAssert, ListBinaryAssert } from '../assert';
import { AssertStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query, QueryList } from '../query';
import { TestExecutionResult } from '../test-result';
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

  async execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const verify = new Verify(page);
    const host = reinterpret<AssertHost>(this.assert);
    return await verify.theCondition(this.query, host, this.value);
  }

  toString(): string {
    const selector = this.query.toString();
    if (isUndefined(this.assert)) {
      return formatSelector(selector);
    }

    const { what, how } = reinterpret<AssertHost>(this.assert);
    if (isUndefined(this.value)) {
      return `I see ${formatSelector(selector)} has ${what}`;
    }

    return `I see ${formatSelector(selector)} has ${what} ${how} \`${this.value}\``;
  }
}