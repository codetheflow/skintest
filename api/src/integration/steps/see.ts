import { Assert, AssertAll, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/check';
import { Select, SelectAll } from '../selector';
import { Step, StepContext } from '../step';
import { pass, TestExecutionResult } from '../test-result';
import { Verify } from '../verify';
import { invalidArgumentError } from '../../common/errors';
import { notFoundElementFail } from '../test-result';
import { formatSelector } from '../formatting';

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
      const query = this.selector.toString();

      switch (this.selector.type) {
        case 'select': {
          const element = await engine.select(query);
          if (!element) {
            return notFoundElementFail(query);
          }

          break;
        }
        case 'selectAll': {
          const elements = await engine.selectAll(query);
          if (!elements.length) {
            return notFoundElementFail(query);
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

    return pass();
  }

  toString() {
    const query = this.selector.toString();

    if (isUndefined(this.assert)) {
      return `see ${formatSelector(query)}`;
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `see that ${formatSelector(query)} has ${what} ${how} ${this.value}`;
  }
}
