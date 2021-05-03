import { Attempt } from '../sdk/attempt';
import { StatusReport } from '../sdk/report-sink';
import { pass, TestExecutionResult } from '../sdk/test-result';
import { timeout } from '../sdk/test-result';
import { unknownEngineError } from '../common/errors';
import * as playwright from 'playwright';

export function playwrightAttempt(count: number, report: StatusReport): Attempt {
  return async (method: () => Promise<void>): TestExecutionResult => {
    let attempts = count;
    let fail = null;
    while (--attempts >= 0) {
      try {
        await method();
      }
      catch (ex) {
        await report.error(ex);
        if (ex instanceof playwright.errors.TimeoutError) {
          fail = timeout(ex);
          continue;
        }

        throw unknownEngineError(ex);
      }
    }

    if (fail) {
      await report.fail(fail);
      return fail;
    }

    await report.pass();
    return pass();
  };
}