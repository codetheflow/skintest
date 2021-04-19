import { Fixture } from './fixture';
import { getSuite } from '../platform/suite';
import { Step } from './step';
import { Guard } from '../infrastructure/guard';

export function feature(name: string): Feature {
  const suite = getSuite();
  Guard.notNull(
    suite,
    `suite is not defined, make sure that you are running tests by using skintest's platform() function`
  );

  const fixture = new Fixture(name);
  suite.addFixture(fixture);
  return fixture;
};

export interface Feature {
  before(what: 'feature' | 'scenario' | 'step', ...steps: Step[]): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...steps: Step[]): Feature;

  scenario(name: string, ...steps: Step[]): Scenario;
}

export interface Scenario {
  scenario(name: string, ...steps: Step[]): Scenario;
}
