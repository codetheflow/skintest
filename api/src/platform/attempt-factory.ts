import { pass, TestExecutionResult, unknownFail } from '../sdk/test-result';
import { Attempt } from './attempt';

export function attemptFactory(retries: number): Attempt {
  return async (method: () => Promise<TestExecutionResult>): Promise<TestExecutionResult> => {
    let attempts = retries;

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
  };
}