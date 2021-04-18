import { Fixture } from '../definition/fixture';

export class Suite {
  private features: Fixture[] = [];

  addFixture(fixture: Fixture): void {
    this.features.push(fixture);
  }

  getFixtures(): Fixture[] {
    return Array.from(this.features);
  }
}