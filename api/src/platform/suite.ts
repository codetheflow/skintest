import { Fixture } from '../spec/fixture';

export interface Suite {
  readonly name: string;
  addFixture(fixture: Fixture): void;
  getFixtures(): Fixture[];
}

class ProjectSuite implements Suite {
  private features: Fixture[] = [];

  constructor(public readonly name: string) {
  }

  addFixture(fixture: Fixture): void {
    this.features.push(fixture);
  }

  getFixtures(): Fixture[] {
    return Array.from(this.features);
  }
}

let currentSuite: Suite;

export function newSuite(name: string): Suite {
  const suite = new ProjectSuite(name);
  currentSuite = suite;
  return suite;
}

export function getSuite(): Suite {
  return currentSuite;
}
