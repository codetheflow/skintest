import { Attempt } from '../../sdk/attempt';
import { StatusReport } from '../report-sink';
import { pass, TestExecutionResult } from '../../sdk/test-result';
import { timeout } from '../../sdk/test-result';
import { unknownDriverError } from '../../common/errors';
import * as playwright from 'playwright';

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

        throw unknownDriverError(ex);
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