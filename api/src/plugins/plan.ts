import { Attempt } from '../platform/attempt';
import { pluginBreak, pluginContinue } from '../platform/plugin';
import { Reporting, StatusReport } from '../platform/report-sink';
import { StageExecutionResult } from '../platform/stage';
import { Browser } from '../sdk/browser';
import { Command, DoStep } from '../sdk/command';
import { ClientFunction, PageClient, Process, ServerFunction } from '../sdk/recipe';
import { fail, pass, TestExecutionResult, unknownFail } from '../sdk/test-result';

export type Plan = typeof plan;

export function plan(browser: Browser, reporting: Reporting, attempt: Attempt) {
  return runSteps;

  async function runSteps(steps: Command[], status: StatusReport): Promise<StageExecutionResult> {
    const context = { browser };
    try {
      for (let step of steps) {
        const result = await attempt(() => step.execute(context));
        if (result.status === 'fail') {
          await status.fail(result);
          return pluginBreak('plan');
        }

        if (step.type === 'do') {
          const doStep = step;
          const funcResult = await attempt(() => runRecipe(doStep, status));
          if (funcResult.status === 'fail') {
            return pluginBreak('plan');
          }
        }

        // show debug info
        if (result.inspect) {
          await status.inspect(result.inspect);
        }
      }

      await status.pass();
      return pluginContinue('plan');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('plan');
    }
  }

  async function runRecipe(step: DoStep, status: StatusReport): Promise<TestExecutionResult> {
    try {
      if (step.recipe.type === 'server') {
        const server = new Process();
        const action = step.recipe.action as ServerFunction;
        const { message } = await action.apply(server, step.args);
        await status.progress(message);
        return pass();
      }

      const page = browser.getCurrentPage();
      const client = new PageClient(page);
      const action = step.recipe.action as ClientFunction;
      const { message, plan } = await action.call(client, step.args);
      await status.progress('I ' + message);
      const result = await runSteps(plan, await reporting.attempt());
      if (result.effect === 'break') {
        await status.fail(fail());
        return fail();
      }

      return pass();
    } catch (ex) {
      await status.error(ex);
      return unknownFail(ex);
    }
  }
}