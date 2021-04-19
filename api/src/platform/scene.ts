import { Fixture } from '../spec/fixture';
import { StepContext } from '../spec/step';

export class Scene {
  constructor(private context: StepContext) {
  }

  async play(fixture: Fixture): Promise<void> {
    // TODO: refactor
    try {
      try {
        await this.beforeFeautre(fixture);
      } catch (ex) {
        console.error(ex);
      }

      for (let [name, steps] of fixture.scenarios) {
        try {
          await this.beforeScenario(fixture);
        } catch (ex) {
          console.error(ex);
        }

        for (let step of steps) {
          try {
            await this.beforeStep(fixture);
          } catch (ex) {
            console.error(ex);
          }

          try {
            await step.execute(this.context);
          } catch (ex) {
            console.error(ex);
          }

          try {
            await this.afterStep(fixture);
          } catch (ex) {
            console.error(ex);
          }

        }

        try {
          await this.afterScenario(fixture);
        } catch (ex) {
          console.error(ex);
        }
      }

    } finally {
      try {
        await this.afterFeautre(fixture);
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  private beforeFeautre(fixture: Fixture): Promise<void[]> {
    return Promise.all(fixture.beforeFeature.map(step => step.execute(this.context)));
  }

  private afterFeautre(fixture: Fixture): Promise<void[]> {
    return Promise.all(fixture.afterFeature.map(step => step.execute(this.context)));
  }

  private beforeScenario(fixture: Fixture): Promise<void[]> {
    return Promise.all(fixture.beforeScenario.map(step => step.execute(this.context)));
  }

  private afterScenario(fixture: Fixture): Promise<void[]> {
    return Promise.all(fixture.afterScenario.map(step => step.execute(this.context)));
  }

  private beforeStep(fixture: Fixture): Promise<void[]> {
    return Promise.all(fixture.beforeStep.map(step => step.execute(this.context)));
  }

  private afterStep(fixture: Fixture): Promise<void[]> {
    return Promise.all(fixture.afterStep.map(step => step.execute(this.context)));
  }
}