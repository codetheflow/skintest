import { pass, TestExecutionResult, unknownFail } from '@skintest/sdk';

export class Attempt {
  constructor(private retries: number) {
    if (retries <= 0) {
      throw new Error('number of retries should be bigger than 0');
    }
  }

  async step(method: () => Promise<TestExecutionResult>): Promise<TestExecutionResult> {
    let attempts = this.retries;

    let result: TestExecutionResult = pass();
    let error = null;
    while (--attempts >= 0) {
      try {
        result = await method();
      }
      catch (ex) {
        error = unknownFail(ex);
      }
    }

    if (error) {
      return error;
    }

    return result;
  }

  async action<T>(method: () => Promise<T>): Promise<T> {
    let attempts = this.retries;

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