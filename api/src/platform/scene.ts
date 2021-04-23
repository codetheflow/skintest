import { Script } from '../integration/script';
import { StepContext } from '../integration/step';

export class Scene {
  constructor(private context: StepContext) {
  }

  async play(script: Script): Promise<void> {
    // TODO: refactor
    try {
      try {
        await this.beforeFeautre(script);
      } catch (ex) {
        console.error(ex);
      }

      for (let [name, steps] of script.scenarios) {
        try {
          await this.beforeScenario(script);
        } catch (ex) {
          console.error(ex);
        }

        for (let step of steps) {
          try {
            await this.beforeStep(script);
          } catch (ex) {
            console.error(ex);
          }

          try {
            await step.execute(this.context);
          } catch (ex) {
            console.error(ex);
          }

          try {
            await this.afterStep(script);
          } catch (ex) {
            console.error(ex);
          }

        }

        try {
          await this.afterScenario(script);
        } catch (ex) {
          console.error(ex);
        }
      }

    } finally {
      try {
        await this.afterFeautre(script);
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  private beforeFeautre(script: Script): Promise<void[]> {
    return Promise.all(script.beforeFeature.map(step => step.execute(this.context)));
  }

  private afterFeautre(script: Script): Promise<void[]> {
    return Promise.all(script.afterFeature.map(step => step.execute(this.context)));
  }

  private beforeScenario(script: Script): Promise<void[]> {
    return Promise.all(script.beforeScenario.map(step => step.execute(this.context)));
  }

  private afterScenario(script: Script): Promise<void[]> {
    return Promise.all(script.afterScenario.map(step => step.execute(this.context)));
  }

  private beforeStep(script: Script): Promise<void[]> {
    return Promise.all(script.beforeStep.map(step => step.execute(this.context)));
  }

  private afterStep(script: Script): Promise<void[]> {
    return Promise.all(script.afterStep.map(step => step.execute(this.context)));
  }
}