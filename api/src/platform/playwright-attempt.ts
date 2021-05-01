import { Attempt } from '../sdk/attempt';
import { StatusReport } from '../sdk/report';
import { pass, TestExecutionResult } from '../sdk/test-result';
import { timeout } from '../sdk/test-result';
import { unknownEngineError } from '../common/errors';
import * as playwright from 'playwright';

export function playwrightAttempt(count: number, report: StatusReport): Attempt {
  return async (method: () => Promise<void>): TestExecutionResult => {
    let attempts = count;
    while (--attempts >= 0) {
      try {
        await method();
      }
      catch (ex) {
        if (ex instanceof playwright.errors.TimeoutError) {
          return timeout(ex);
        }

        throw unknownEngineError(ex);
      }
    }

    report.pass();
    return pass();
  };
}