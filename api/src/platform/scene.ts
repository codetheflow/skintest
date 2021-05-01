import { Attempt } from '../sdk/attempt';
import { Engine } from '../sdk/engine';
import { Report, StatusReport, ReportStepContext } from '../sdk/report';
import { Script } from '../sdk/script';
import { Command, StepContext } from '../sdk/command';
import { invalidArgumentError } from '../common/errors';

export class Scene {
  constructor(
    private engine: Engine,
    private report: Report,
    private attempt: Attempt
  ) {
  }

  async play(script: Script): Promise<void> {
    const { report } = this;
    const featureContext = { feature: script.name };

    await this.run(
      script.beforeFeature,
      report.beforeFeature(featureContext)
    );

    for (let [scenarioText, commands] of script.scenarios) {
      const scenarioContext = { ...featureContext, scenario: scenarioText };

      await this.run(
        script.beforeScenario,
        report.beforeScenario(scenarioContext)
      );

      for (let command of commands) {
        const stepContext = { ...scenarioContext, step: command.toString() };

        await this.run(
          script.beforeStep,
          report.beforeStep(stepContext)
        );

        const result = await this.run(
          [command],
          this.getReport(command.type, stepContext)
        );

        await this.run(
          script.afterStep,
          report.afterStep(stepContext)
        );

        if (!result && command.type !== 'assert') {
          break;
        }
      }

      await this.run(
        script.afterScenario,
        report.afterScenario(scenarioContext)
      );
    }

    await this.run(
      script.afterFeature,
      report.afterFeature(featureContext)
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
          status.fail(result);
          return false;
        }

        // show debug info
        if (result.inspect) {
          await this.report.inspect(result.inspect);
        }
      }

      status.pass();
      return true;
    } catch (ex) {
      status.error(ex);
      return false;
    }
  }

  private getReport(type: Command['type'], context: ReportStepContext) {
    const { report } = this;

    switch (type) {
      case 'assert': return report.assert(context);
      case 'check': return report.check(context);
      case 'dev': return report.dev(context);
      case 'ui': return report.ui(context);
      case 'say': return report.say(context);
      default:
        throw invalidArgumentError('type', type);
    }
  }
}