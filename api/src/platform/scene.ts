import { Attempt } from '../sdk/attempt';
import { ClientFunction, EngineClient, Process, ServerFunction } from '../sdk/recipe';
import { Command, DoStep, StepContext } from '../sdk/command';
import { Engine } from '../sdk/engine';
import { invalidArgumentError } from '../common/errors';
import { Reporting, StatusReport, ReportStepContext } from '../sdk/report-sink';
import { Script } from '../sdk/script';

export class Scene {
  constructor(
    private engine: Engine,
    private reporting: Reporting,
    private attempt: Attempt
  ) {
  }

  async play(script: Script): Promise<void> {
    if (await this.beforeFeature(script)) {
      for (let [scenarioText, commands] of script.scenarios) {
        if (await this.beforeScenario(script, scenarioText)) {
          for (let command of commands) {
            const stepText = command.toString();

            let result = true;
            if (await this.beforeStep(script, scenarioText, stepText)) {
              result = await this.step(
                script,
                scenarioText,
                command
              );
            }

            await this.afterStep(script, scenarioText, stepText);

            if (!result && command.type !== 'assert') {
              break;
            }
          }
        }

        await this.afterScenario(script, scenarioText);
      }
    }

    await this.afterFeature(script);
  }

  private beforeFeature(script: Script): Promise<boolean> {
    const { reporting } = this;
    const context = { feature: script.name };

    return this.runSteps(
      script.beforeFeature,
      reporting.beforeFeature(context)
    );
  }

  private afterFeature(script: Script): Promise<boolean> {
    const { reporting } = this;
    const context = { feature: script.name };

    return this.runSteps(
      script.afterFeature,
      reporting.afterFeature(context)
    );
  }

  private beforeScenario(
    script: Script,
    scenario: string
  ): Promise<boolean> {
    const { reporting } = this;
    const context = { feature: script.name, scenario };

    return this.runSteps(
      script.beforeScenario,
      reporting.beforeScenario(context)
    );
  }

  private afterScenario(
    script: Script,
    scenario: string
  ): Promise<boolean> {
    const { reporting } = this;
    const context = { feature: script.name, scenario };

    return this.runSteps(
      script.afterScenario,
      reporting.afterScenario(context)
    );
  }

  private step(
    script: Script,
    scenario: string,
    step: Command
  ): Promise<boolean> {
    const context = { feature: script.name, scenario, step: step.toString() };
    const stepReport = this.getReport(step.type, context);

    return this.runSteps([step], stepReport);
  }

  private beforeStep(
    script: Script,
    scenario: string,
    step: string,
  ): Promise<boolean> {
    const { reporting } = this;
    const context = { feature: script.name, scenario, step };

    return this.runSteps(
      script.beforeStep,
      reporting.beforeStep(context)
    );
  }

  private afterStep(
    script: Script,
    scenario: string,
    step: string,
  ): Promise<boolean> {
    const { reporting } = this;
    const context = { feature: script.name, scenario, step };

    return this.runSteps(
      script.afterStep,
      reporting.afterStep(context)
    );
  }

  private async runSteps(commands: Command[], status: StatusReport): Promise<boolean> {
    const { engine, attempt } = this;
    const context: StepContext = {
      attempt,
      engine,
    };

    try {
      for (let command of commands) {
        const result = await command.execute(context);
        if (result.status === 'fail') {
          await status.fail(result);
          return false;
        }

        if (command.type === 'do') {
          const funcResult = await this.runFunction(command, status);
          if (!funcResult) {
            return false;
          }
        }

        // show debug info
        if (result.inspect) {
          await status.inspect(result.inspect);
        }
      }

      await status.pass();
      return true;
    } catch (ex) {
      await status.error(ex);
      return false;
    }
  }

  private async runFunction(command: DoStep, status: StatusReport): Promise<boolean> {
    if (command.recipe.type === 'server') {
      const server = new Process();
      const action = command.recipe.action as ServerFunction;
      const { message } = await action.apply(server, command.args);
      await status.progress(message);
      return true;
    }

    const client = new EngineClient(this.engine);
    const action = command.recipe.action as ClientFunction;
    const { message, steps } = await action.call(client, command.args);
    await status.progress('I ' + message);
    const recipeResult = await this.runSteps(steps, this.reporting.attempt());
    if (!recipeResult) {
      return false;
    }

    return true;
  }

  private getReport(type: Command['type'], context: ReportStepContext) {
    const { reporting } = this;

    switch (type) {
      case 'assert': return reporting.assert(context);
      case 'check': return reporting.check(context);
      case 'dev': return reporting.dev(context);
      case 'client': return reporting.client(context);
      case 'info': return reporting.info(context);
      case 'do': return reporting.do(context);
      default:
        throw invalidArgumentError('type', type);
    }
  }
}