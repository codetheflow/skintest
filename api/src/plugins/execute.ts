import { Plugin, pluginBreak, PluginContext, pluginContinue, PluginExecutionResult } from '../platform/plugin';
import { Command, DoStep } from '../sdk/command';
import { ClientFunction, DriverClient, Process, ServerFunction } from '../sdk/recipe';
import { StatusReport } from '../sdk/report-sink';

export type Execute = typeof execute;

export function execute(commands: Command[], status: StatusReport): Plugin {

  async function execSteps(context: PluginContext): Promise<PluginExecutionResult> {
    try {
      for (let command of commands) {
        const result = await command.execute(context);
        if (result.status === 'fail') {
          await status.fail(result);
          return pluginBreak('run-steps');
        }

        if (command.type === 'do') {
          const funcResult = await execRecipe(command, status, context);
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
      return pluginContinue('execute');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('execute');
    }
  }

  async function execRecipe(command: DoStep, status: StatusReport, context: PluginContext): Promise<PluginExecutionResult> {
    try {
      const { reporting, driver } = context;
      if (command.recipe.type === 'server') {
        const server = new Process();
        const action = command.recipe.action as ServerFunction;
        const { message } = await action.apply(server, command.args);
        await status.progress(message);
        return pluginContinue('run-function');
      }

      const client = new DriverClient(driver);
      const action = command.recipe.action as ClientFunction;
      const { message, steps } = await action.call(client, command.args);
      await status.progress('I ' + message);
      const recipe = execute(steps, await reporting.attempt());
      const result = await recipe(context);
      if (result.effect === 'break') {
        return result;
      }

      return pluginContinue('recipe');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('recipe');
    }

  }

  return execSteps;
}