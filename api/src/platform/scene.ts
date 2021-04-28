import { Attempt } from '../integration/attempt';
import { DebugStep } from '../integration/steps/debug';
import { InspectStep } from '../integration/steps/inspect';
import { Engine } from '../integration/engine';
import { PauseStep } from '../integration/steps/pause';
import { Report, StatusReport } from '../integration/report';
import { SayStep } from '../integration/steps/say';
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

        const result = await this.run([step], this.selectReport(step));

        await this.run(
          script.afterStep,
          report.afterStep(stepText)
        );

        if (!result) {
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

  private async run(steps: Step[], status: StatusReport): Promise<boolean> {
    const { engine, attempt } = this;
    const context: StepContext = {
      attempt,
      engine,
    };

    try {
      for (let step of steps) {
        const result = await step.execute(context);
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

  private selectReport(step: Step) {
    const { report } = this;
    const stepText = step.toString();

    if (step instanceof SayStep) {
      return this.report.say(stepText);
    }

    if (step instanceof DebugStep
      || step instanceof InspectStep
      || step instanceof PauseStep) {
      return this.report.debug(stepText)
    }

    return report.step(stepText)
  }
}