import { Guard, reinterpret, retry, RetryOptions } from '@skintest/common';
import { AssertStep, ClientStep, StepContext, StepExecutionAssertResult, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class WaitStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private assert: AssertStep
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(assert, 'assert');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { timeout } = context.browser;
    const options: RetryOptions<StepExecutionAssertResult> = {
      timeout,
      // todo: how we can do it better?
      delay: timeout / 10,
      until: test => test.result.status === 'pass',
      // we already have timeout exception from the browser, 
      // no need to wait anymore
      untilError: ex => ex.name === 'skintest.timeout',
    };

    const attempts = retry(options);
    return attempts(() =>
      reinterpret<Promise<StepExecutionAssertResult>>(
        this.assert.execute(context)
      ));
  }

  toString(): string {
    return `I wait ${this.assert.toString()}`;
  }
}