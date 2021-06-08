import { errors } from '@skintest/common';
import { StepExecutionResult } from '@skintest/sdk';

export class Attempt {
  constructor(private retries: number) {
    if (retries <= 0) {
      throw errors.invalidArgument('retries', retries);
    }
  }

  async step(method: () => Promise<StepExecutionResult>): Promise<StepExecutionResult> {
    let attempts = this.retries;

    // todo: better type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error = null;

    while (--attempts >= 0) {
      try {
        return await method();
      }
      catch (ex) {
        error = ex;
      }
    }

    throw error;
  }
}