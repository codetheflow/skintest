import { Attempt } from '../integration/attempt';
import { Engine } from '../integration/engine';
import { Report, StatusReport } from '../integration/report';
import { Script } from '../integration/script';
import { Step, StepContext } from '../integration/step';

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

    for (let [scenarioText, steps] of script.scenarios) {
      await this.run(
        script.beforeScenario,
        report.beforeScenario(scenarioText)
      );

      for (let step of steps) {
        const stepText = step.toString();

        await this.run(
          script.beforeStep,
          report.beforeStep(stepText)
        );

        await this.run([step], report.step(stepText));

        await this.run(
          script.afterStep,
          report.afterStep(stepText)
        );
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

  private async run(steps: Step[], status: StatusReport): Promise<void> {
    const { engine, attempt } = this;
    const context: StepContext = {
      attempt,
      engine,
    };

    try {
      for (let step of steps) {
        const failReason = await step.execute(context);
        if (failReason) {
          status.fail(failReason);
          break;
        }
      }

      status.pass();
    } catch (ex) {
      status.error(ex);
    }
  }
}