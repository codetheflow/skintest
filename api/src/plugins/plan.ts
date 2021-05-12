import { Attempt } from '../platform/attempt';
import { pluginBreak, pluginContinue, PluginExecutionResult } from '../platform/plugin';
import { Reporting, StatusReport } from '../platform/report-sink';
import { Browser } from '../sdk/browser';
import { Command, DoStep } from '../sdk/command';
import { ClientFunction, PageClient, Process, ServerFunction } from '../sdk/recipe';
import { testFail } from '../sdk/test-result';

export type Plan = typeof plan;

export function plan(browser: Browser, reporting: Reporting, attempt: Attempt) {
  return runSteps;

  async function runSteps(steps: Command[], status: StatusReport): Promise<PluginExecutionResult> {
    const context = { browser };
    try {
      for (let step of steps) {
        const result = await step.execute(context);
        if (result.status === 'fail') {
          await status.fail(result);
          return pluginBreak('run-plan');
        }

        if (step.type === 'do') {
          const funcResult = await runRecipe(step, status);
          if (funcResult.effect === 'break') {
            return funcResult;
          }
        }

        // show debug info
        if (result.inspect) {
          await status.inspect(result.inspect);
        }
      }

      await status.pass();
      return pluginContinue('execute-plan');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('execute-plan');
    }
  }

  async function runRecipe(step: DoStep, status: StatusReport): Promise<PluginExecutionResult> {
    try {
      if (step.recipe.type === 'server') {
        const server = new Process();
        const action = step.recipe.action as ServerFunction;
        const { message } = await action.apply(server, step.args);
        await status.progress(message);
        return pluginContinue('run-function');
      }

      const page = browser.getCurrentPage();
      const client = new PageClient(page);
      const action = step.recipe.action as ClientFunction;
      const { message, plan } = await action.call(client, step.args);
      await status.progress('I ' + message); 
      const result = await runSteps(plan, await reporting.attempt());
      if (result.effect === 'break') {
        await status.fail(testFail());
        return result;
      }

    //  await status.pass();
      return pluginContinue('recipe');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('recipe');
    }
  }
}