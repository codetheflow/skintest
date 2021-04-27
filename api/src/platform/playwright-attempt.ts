import { Attempt } from '../integration/attempt';
import { StatusReport } from '../integration/report';
import { TestExecutionResult } from '../integration/test-result';
import { unknownEngineError } from '../common/errors';
import * as playwright from 'playwright';

export function playwrightAttempt(count: number, report: StatusReport): Attempt {
  return async (method: () => Promise<void>): TestExecutionResult => {
    while (--count >= 0) {
      try {
        await method();
      }
      catch (ex) {
        if (ex instanceof playwright.errors.TimeoutError) {
          return {
            code: 'TIMEOUT_ERROR',
            description: ex.message,
            solution: 'try to change selector or make sure that element is available '
          };
        }

        throw unknownEngineError(ex);
      }
    }

    report.pass();
    return null;
  };
}