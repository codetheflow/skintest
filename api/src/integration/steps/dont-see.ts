import { Assert, AssertAll, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/check';
import { SeeStep } from './see';
import { Select, SelectAll } from '../selector';
import { Step, StepContext } from '../step';
import { pass, TestExecutionResult } from '../test-result';
import { dontSeeFail } from '../test-result';
import { formatSelector } from '../formatting';

export class DontSeeStep implements Step {
  constructor(
    private selector: Select<any> | SelectAll<any>,
    private assert: Assert<any> | AssertAll<any>,
    private value: any
  ) {
    Guard.notNull(selector, 'selector');
  }

  async execute(context: StepContext): TestExecutionResult {
    const seeStep = new SeeStep(this.selector, this.assert, this.value);
    const failReason = await seeStep.execute(context);
    if (!failReason) {
      return dontSeeFail();
    }

    return pass();
  }

  toString() {
    const query = this.selector.toString();
    if (isUndefined(this.assert)) {
      return `don't see ${formatSelector(query)}`;
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `dont't see that ${formatSelector(query)} has ${what} ${how} ${this.value}`;
  }
}
