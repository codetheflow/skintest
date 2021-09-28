import { Guard, Meta, reinterpret, retry, RetryOptions } from '@skintest/common';
import { AssertStep, ClientStep, StepContext, StepExecutionAssertResult, StepExecutionResult } from '../command';

export class WaitStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private assert: AssertStep<D>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(assert, 'assert');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    // todo: make settings for the timeout
    const timeout = 30000;
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
    return `wait ${this.assert.toString()}`;
  }
}