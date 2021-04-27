import { Assert, AssertAll, AssertHost } from '../assert';
import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/check';
import { SeeStep } from './see';
import { Select, SelectAll } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

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
      return {
        code: '',
        description: '',
        solution: ''
      };
    }

    return null;
  }

  toString() {
    if (isUndefined(this.assert)) {
      return `don't see ${this.selector.query}`;
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `dont't see that ${this.selector.query} has ${what} ${how} ${this.value}`;
  }
}