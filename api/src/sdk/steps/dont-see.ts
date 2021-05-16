import { Guard } from '../../common/guard';
import { isUndefined } from '../../common/utils';
import { AssertHost, BinaryAssert, ListAssert } from '../assert';
import { AssertStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { Query, QueryList } from '../query';
import { dontSeeFail, pass, TestExecutionResult } from '../test-result';
import { SeeStep } from './see';

export class DontSeeStep implements AssertStep {
  type: 'assert' = 'assert';

  constructor(
    private query: Query<any> | QueryList<any>,
    private assert: BinaryAssert<any> | ListAssert<any>,
    private value: any
  ) {
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    const seeStep = new SeeStep(this.query, this.assert, this.value);
    const failReason = await seeStep.execute(context);
    if (!failReason) {
      return dontSeeFail();
    }

    return pass();
  }

  toString() {
    const query = this.query.toString();
    if (isUndefined(this.assert)) {
      return formatSelector(query);
    }

    const { what, how } = this.assert as AssertHost<any>;
    return `I don't see ${formatSelector(query)} has ${what} ${how} \`${this.value}\``;
  }
}
