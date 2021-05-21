import { Guard } from '@skintest/common';
import { getMeta } from './meta';
import { ScenarioSchema, StorySchema } from './schema';
import { RuntimeScript } from './script';
import { getSuite } from './suite';

export function feature(name: string): Feature {
  const suite = getSuite();

  // todo: make error from errors
  Guard.notNull(
    suite,
    `suite is not defined, make sure that you are running tests by using skintest's platform() function`
  );

  const script = new RuntimeScript(name, getMeta());
  suite.addScript(script);
  return script;
}

export interface Feature {
  before(what: 'feature' | 'scenario' | 'step', ...plan: StorySchema): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...plan: StorySchema): Feature;

  scenario(name: string, ...plan: ScenarioSchema): Scenario;
}

export interface Scenario {
  scenario(name: string, ...plan: ScenarioSchema): Scenario;
}