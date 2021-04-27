import { Assert, AssertAll, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/check';
import { Select, SelectAll } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';
import { Verify } from '../verify';
import { invalidArgumentError } from '../../common/errors';
import { notFoundElementFail } from '../fails';

export class SeeStep implements Step {
  constructor(
    private selector: Select<any> | SelectAll<any>,
    private assert: Assert<any> | AssertAll<any>,
    private value: any
  ) {
    Guard.notNull(selector, 'selector');
  }

  async execute(context: StepContext): TestExecutionResult {
    const { engine } = context;
    if (isUndefined(this.assert)) {
      switch (this.selector.type) {
        case 'select': {
          const element = await engine.select(this.selector.query);
          if (!element) {
            return notFoundElementFail(this.selector.query);
          }

          break;
        }
        case 'selectAll': {
          const elements = await engine.selectAll(this.selector.query);
          if (!elements.length) {
            return notFoundElementFail(this.selector.query);
          }

          break;
        }
        default: {
          throw invalidArgumentError('selector', (this.selector as any).type);
        }
      }
    } else {
      const verify = new Verify(engine);
      const { what, how } = this.assert as AssertHost<any>;

      switch (this.selector.type) {
        case 'select': {
          return await verify.element(this.selector, what, how, this.value);
        }
        case 'selectAll': {
          return await verify.elements(this.selector, what, how, this.value);
        }
        default: {
          throw invalidArgumentError('selector', (this.selector as any).type);
        }
      }
    }

    return Promise.resolve(null);
  }

  toString() {
    if (isUndefined(this.assert)) {
      return `see ${this.selector.query}`;
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `see that ${this.selector.query} has ${what} ${how} ${this.value}`;
  }
}