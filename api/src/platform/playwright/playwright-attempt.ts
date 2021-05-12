import * as playwright from 'playwright';
import { unknownPageError } from '../../common/errors';
import { pass, TestExecutionResult, timeout } from '../../sdk/test-result';
import { Attempt } from '../attempt';
import { StatusReport } from '../report-sink';

export function playwrightAttempt(retries: number, status: StatusReport): Attempt {
  return async (method: () => Promise<void>): TestExecutionResult => {
    let attempts = retries;
    let fail = null;
    while (--attempts >= 0) {
      try {
        await method();
      }
      catch (ex) {
        await status.error(ex);
        if (ex instanceof playwright.errors.TimeoutError) {
          fail = timeout(ex);
          continue;
        }

        throw unknownPageError(ex);
      }
    }

    if (fail) {
      await status.fail(fail);
      return fail;
    }

    await status.pass();
    return pass();
  };
}