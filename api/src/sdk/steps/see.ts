import { invalidArgumentError } from '../../common/errors';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/utils';
import { AssertHost, BinaryAssert, ListAssert } from '../assert';
import { AssertStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { Query, QueryList } from '../query';
import { notFoundElement, TestExecutionResult } from '../test-result';
import { Verify } from '../verify';

export class SeeStep implements AssertStep {
  type: 'assert' = 'assert';

  constructor(
    private query: Query<any> | QueryList<any>,
    private assert: BinaryAssert<any> | ListAssert<any>,
    private value: any
  ) {
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): TestExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    if (isUndefined(this.assert)) {
      const selector = this.query.toString();

      switch (this.query.type) {
        case 'query': {
          const element = await page.query(selector);
          if (!element) {
            return notFoundElement(selector);
          }

          break;
        }
        case 'queryList': {
          const elements = await page.queryList(selector);
          if (!elements.length) {
            return notFoundElement(selector);
          }

          break;
        }
        default: {
          throw invalidArgumentError('selector', (this.query as any).type);
        }
      }
    }

    const verify = new Verify(page);
    const { what, how } = this.assert as AssertHost<any>;

    switch (this.query.type) {
      case 'query': {
        return await verify.element(this.query, what, how, this.value);
      }
      case 'queryList': {
        return await verify.elementList(this.query, what, how, this.value);
      }
      default: {
        throw invalidArgumentError('selector', (this.query as any).type);
      }
    }
  }

  toString() {
    const selector = this.query.toString();

    if (isUndefined(this.assert)) {
      return formatSelector(selector);
    }

    const { what, how } = this.assert as AssertHost<any>;
    if (isUndefined(this.value)) {
      return `I see ${formatSelector(selector)} has ${what}`;
    }

    return `I see ${formatSelector(selector)} has ${what} ${how} \`${this.value}\``;
  }
}
