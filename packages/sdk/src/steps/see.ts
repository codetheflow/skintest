import { errors, Guard, isUndefined, reinterpret } from '@skintest/common';
import { AssertHost, BinaryAssert, ListBinaryAssert } from '../assert';
import { AssertStep, StepContext } from '../command';
import { DOMElement } from '../dom';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query, QueryList } from '../query';
import { fails, TestExecutionResult } from '../test-result';
import { Verify } from '../verify';

export class SeeStep implements AssertStep {
  type: 'assert' = 'assert';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query<DOMElement> | QueryList<DOMElement>,
    private assert: BinaryAssert<DOMElement> | ListBinaryAssert<DOMElement>,
    private value: unknown
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    if (isUndefined(this.assert)) {
      const selector = this.query.toString();

      switch (this.query.type) {
        case 'query': {
          const element = await page.query(selector);
          if (!element) {
            return fails.elementNotFound({
              query: this.query
            });
          }

          break;
        }
        case 'queryList': {
          const elements = await page.queryList(selector);
          if (!elements.length) {
            return fails.elementNotFound({
              query: this.query
            });
          }

          break;
        }
        default: {
          throw errors.invalidArgument('selector', (this.query as any).type);
        }
      }
    }

    const verify = new Verify(page);
    const { what, how } = reinterpret<AssertHost>(this.assert);

    switch (this.query.type) {
      case 'query': {
        return await verify.element(this.query, what, how, this.value);
      }
      case 'queryList': {
        return await verify.elementList(this.query, what, how, this.value);
      }
      default: {
        throw errors.invalidArgument('selector', (this.query as any).type);
      }
    }
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