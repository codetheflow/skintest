import { Attempt } from '../sdk/attempt';
import { Engine } from '../sdk/engine';
import { Report, StatusReport } from '../sdk/report';
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

    await this.run(
      script.beforeFeature,
      report.beforeFeature(script.name)
    );

    for (let [scenarioText, commands] of script.scenarios) {
      await this.run(
        script.beforeScenario,
        report.beforeScenario(scenarioText)
      );

      for (let command of commands) {
        const commandText = command.toString();

        await this.run(
          script.beforeStep,
          report.beforeStep(commandText)
        );

        const result = await this.run([command], this.selectReport(command));

        await this.run(
          script.afterStep,
          report.afterStep(commandText)
        );

        if (!result && command.type !== 'assert') {
          break;
        }
      }

      await this.run(
        script.afterScenario,
        report.afterScenario(scenarioText)
      );
    }

    await this.run(
      script.afterFeature,
      report.afterFeature(script.name)
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

  private selectReport(command: Command) {
    const { report } = this;
    const commandText = command.toString();

    switch (command.type) {
      case 'assert': return report.assert(commandText);
      case 'check': return report.check(commandText);
      case 'dev': return report.dev(commandText);
      case 'ui': return report.ui(commandText);
      case 'say': return report.say(commandText);
      default:
        throw invalidArgumentError('type', (command as any).type);
    }
  }
}