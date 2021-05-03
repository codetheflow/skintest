import { BinaryAssert, ListAssert, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/utils';
import { Query, QueryList } from '../query';
import { AssertStep, ClientStep, StepContext } from '../command';
import { pass, TestExecutionResult } from '../test-result';
import { Verify } from '../verify';
import { invalidArgumentError } from '../../common/errors';
import { notFoundElement } from '../test-result';
import { formatSelector } from '../format';

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
    const { engine } = context;
    if (isUndefined(this.assert)) {
      const selector = this.query.toString();

      switch (this.query.type) {
        case 'query': {
          const element = await engine.select(selector);
          if (!element) {
            return notFoundElement(selector);
          }

          break;
        }
        case 'queryList': {
          const elements = await engine.selectAll(selector);
          if (!elements.length) {
            return notFoundElement(selector);
          }

          break;
        }
        default: {
          throw invalidArgumentError('selector', (this.query as any).type);
        }
      }
    } else {
      const verify = new Verify(engine);
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

    return pass();
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
