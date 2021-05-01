import { Assert, AssertAll, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/utils';
import { Select, SelectAll } from '../selector';
import { AssertStep, UIStep, StepContext } from '../command';
import { pass, TestExecutionResult } from '../test-result';
import { Verify } from '../verify';
import { invalidArgumentError } from '../../common/errors';
import { notFoundElement } from '../test-result';
import { formatSelector } from '../formatting';

export class SeeStep implements AssertStep {
  type: 'assert' = 'assert';

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
            return notFoundElement(query);
          }

          break;
        }
        case 'selectAll': {
          const elements = await engine.selectAll(query);
          if (!elements.length) {
            return notFoundElement(query);
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
      return formatSelector(query);
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `I see ${formatSelector(query)} has ${what} ${how} \`${this.value}\``;
  }
}
