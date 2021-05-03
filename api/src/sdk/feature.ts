import { getSuite } from './suite';
import { Guard } from '../common/guard';
import { Script } from './script';
import { Path, UIStep } from './path';

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
  before(what: 'feature' | 'scenario' | 'step', ...steps: UIStep[]): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...steps: UIStep[]): Feature;

  scenario(name: string, ...steps: Path): Scenario;
}

export interface Scenario {
  scenario(name: string, ...steps: Path): Scenario;
}
