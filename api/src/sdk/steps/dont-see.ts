import { Assert, AssertAll, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/utils';
import { SeeStep } from './see';
import { Select, SelectAll } from '../selector';
import { AssertStep, StepContext } from '../command';
import { pass, TestExecutionResult } from '../test-result';
import { dontSeeFail } from '../test-result';
import { formatSelector } from '../formatting';

export class DontSeeStep implements AssertStep {
  type: 'assert' = 'assert';

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
      return formatSelector(query);
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `I don't see ${formatSelector(query)} has ${what} ${how} \`${this.value}\``;
  }
}
