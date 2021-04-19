import { Fixture } from '../spec/fixture';
import { StepContext } from '../spec/step';

export class Scene {
  constructor(private context: StepContext) {
  }

  async play(fixture: Fixture): Promise<void> {
    try {
      try {
        await this.beforeFeautre(fixture);
      } catch (ex) {

      }

      for (let [name, steps] of fixture.scenarios) {
        for (let step of steps) {
          try {
            await this.beforeScenario(fixture);
          } catch (ex) {

          }

          try {
            await step.execute(this.context);
          } catch (ex) {

          }

          try {
            await this.afterScenario(fixture);
          } catch (ex) {

          }
        }
      }

    } finally {
      try {
        await this.afterFeautre(fixture);
      } catch (ex) {

      }
    }
  }

  private beforeFeautre(suite: Fixture): Promise<void[]> {
    return Promise.all(suite.beforeFeature.map(step => step.execute(this.context)));
  }

  private beforeScenario(suite: Fixture): Promise<void[]> {
    return Promise.all(suite.beforeScenario.map(step => step.execute(this.context)));
  }

  private afterFeautre(suite: Fixture): Promise<void[]> {
    return Promise.all(suite.afterFeature.map(step => step.execute(this.context)));
  }

  private afterScenario(suite: Fixture): Promise<void[]> {
    return Promise.all(suite.afterScenario.map(step => step.execute(this.context)));
  }
}