import { Script } from './script';
import { getSuite } from '../platform/suite';
import { Step } from './step';
import { Guard } from '../utils/guard';

export function feature(name: string): Feature {
  const suite = getSuite();
  Guard.notNull(
    suite,
    `suite is not defined, make sure that you are running tests by using skintest's platform() function`
  );

  const script = new Script(name);
  suite.addScript(script);
  return script;
};

export interface Feature {
  before(what: 'feature' | 'scenario' | 'step', ...steps: Step[]): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...steps: Step[]): Feature;

  scenario(name: string, ...steps: Step[]): Scenario;
}

export interface Scenario {
  scenario(name: string, ...steps: Step[]): Scenario;
}
