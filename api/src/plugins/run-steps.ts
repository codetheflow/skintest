import { Plugin, pluginBreak, PluginContext, pluginContinue, PluginExecutionResult } from '../platform/plugin';
import { Command, DoStep } from '../sdk/command';
import { ClientFunction, DriverClient, Process, ServerFunction } from '../sdk/recipe';
import { StatusReport } from '../sdk/report-sink';

export type RunCommands = typeof runCommands;

export function runCommands(commands: Command[], status: StatusReport): Plugin {

  async function runSteps(context: PluginContext): Promise<PluginExecutionResult> {
    try {
      for (let command of commands) {
        const result = await command.execute(context);
        if (result.status === 'fail') {
          await status.fail(result);
          return pluginBreak('run-steps');
        }

        if (command.type === 'do') {
          const funcResult = await runStepFunction(command, status, context);
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
      return pluginContinue('run-steps');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('run-steps');
    }
  }

  async function runStepFunction(command: DoStep, status: StatusReport, context: PluginContext): Promise<PluginExecutionResult> {
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
      const recipeResult = await runCommands(steps, await reporting.attempt());
      if (!recipeResult) {
        return pluginBreak('run-function');
      }

      return pluginContinue('run-function');
    } catch (ex) {
      await status.error(ex);
      return pluginBreak('run-function');
    }

  }

  return runSteps;
}