import { pass, TestExecutionResult, unknownFail } from '../sdk/test-result';
import { Attempt } from './attempt';
import { StatusReport } from './report-sink';

export function attemptFactory(retries: number, status: StatusReport): Attempt {
  return async (method: () => Promise<TestExecutionResult>): Promise<TestExecutionResult> => {
    let attempts = retries;

    let result: TestExecutionResult = pass();
    let error = null;
    while (--attempts >= 0) {
      try {
        result = await method();
      }
      catch (ex) {
        await status.error(ex);
        error = unknownFail(ex);
      }
    }

    if (error) {
      await status.fail(error);
      return error;
    }

    return result;
  };
}