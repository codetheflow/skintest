import { Fixture } from './fixture';
import { getProject } from '../infrastructure/project';
import { Step } from '../command/step';

export function feature(name: string): Feature {
  const { suite } = getProject();
  const fixture = new Fixture(name);
  suite.addFixture(fixture);
  return fixture;
};

export interface Feature {
  before(what: 'feature' | 'scenario', ...steps: Step[]): Feature;
  after(what: 'feature' | 'scenario', ...steps: Step[]): Feature;

  scenario(name: string, ...steps: Step[]): Scenario;
}

export interface Scenario {
  scenario(name: string, ...steps: Step[]): Scenario;
}
