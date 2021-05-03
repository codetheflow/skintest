import { Attempt } from '../sdk/attempt';
import { Engine } from '../sdk/engine';
import { Reporting, StatusReport, ReportStepContext } from '../sdk/report-sink';
import { Script } from '../sdk/script';
import { Command, StepContext } from '../sdk/command';
import { invalidArgumentError } from '../common/errors';

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
    const { reporting: report } = this;
    const context = { feature: script.name };

    return this.run(
      script.beforeFeature,
      report.beforeFeature(context)
    );
  }

  private afterFeature(script: Script): Promise<boolean> {
    const { reporting: report } = this;
    const context = { feature: script.name };

    return this.run(
      script.afterFeature,
      report.afterFeature(context)
    );
  }

  private beforeScenario(
    script: Script,
    scenario: string
  ): Promise<boolean> {
    const { reporting: report } = this;
    const context = { feature: script.name, scenario };

    return this.run(
      script.beforeScenario,
      report.beforeScenario(context)
    );
  }

  private afterScenario(
    script: Script,
    scenario: string
  ): Promise<boolean> {
    const { reporting: report } = this;
    const context = { feature: script.name, scenario };

    return this.run(
      script.afterScenario,
      report.afterScenario(context)
    );
  }

  private step(
    script: Script,
    scenario: string,
    step: Command
  ): Promise<boolean> {
    const { reporting: report } = this;
    const context = { feature: script.name, scenario, step: step.toString() };
    const stepReport = this.getReport(step.type, context);

    return this.run([step], stepReport);
  }

  private beforeStep(
    script: Script,
    scenario: string,
    step: string,
  ): Promise<boolean> {
    const { reporting: report } = this;
    const context = { feature: script.name, scenario, step };

    return this.run(
      script.beforeStep,
      report.beforeStep(context)
    );
  }


  private afterStep(
    script: Script,
    scenario: string,
    step: string,
  ): Promise<boolean> {
    const { reporting: report } = this;
    const context = { feature: script.name, scenario, step };

    return this.run(
      script.afterStep,
      report.afterStep(context)
    );
  }

  private async run(commands: Command[], status: StatusReport): Promise<boolean> {
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
          // TODO: add separate interface
          const doSteps = command.recipe.action(command.args);
          const doResult = await this.run(doSteps, status);
          if (!doResult) {
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

  private getReport(type: Command['type'], context: ReportStepContext) {
    const { reporting: report } = this;

    switch (type) {
      case 'assert': return report.assert(context);
      case 'check': return report.check(context);
      case 'dev': return report.dev(context);
      case 'client': return report.client(context);
      case 'say': return report.say(context);
      case 'do': return report.do(context);
      default:
        throw invalidArgumentError('type', type);
    }
  }
}