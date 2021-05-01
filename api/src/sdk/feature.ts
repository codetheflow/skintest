import { getSuite } from './suite';
import { Guard } from '../common/guard';
import { Script } from './script';
import { SupportDebug, Walk } from './walk';
import { UIStep } from './command';

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
  before(what: 'feature' | 'scenario' | 'step', ...steps: SupportDebug<UIStep>[]): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...steps: SupportDebug<UIStep>[]): Feature;

  scenario(name: string, ...steps: Walk): Scenario;
}

export interface Scenario {
  scenario(name: string, ...steps: Walk): Scenario;
}
