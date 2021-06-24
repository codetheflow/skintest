import { getCaller, getMeta, Guard } from '@skintest/common';
import { DataStep } from './command';
import { ScenarioSchema, StorySchema } from './schema';
import { RuntimeScript } from './script';
import { getSuite } from './suite';

export function feature(): Feature {
  const suite = getSuite();

  // todo: make error from errors
  Guard.notNull(
    suite,
    `suite is not defined, make sure that you are running tests by using skintest platform() function`
  );

  const caller = getCaller();
  const script = new RuntimeScript(`feature-${Date.now()}`, () => getMeta(caller));
  suite.addScript(script);
  return script;
}

export interface Feature {
  before(what: 'feature' | 'scenario' | 'step', ...step: StorySchema<undefined>): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...step: StorySchema<undefined>): Feature;

  scenario<T>(name: string, data: DataStep<T>, ...step: ScenarioSchema<T>): Scenario;
  scenario(name: string, ...step: ScenarioSchema<undefined>): Scenario;
}

export interface Scenario {
  scenario<T>(name: string, data: DataStep<T>, ...step: ScenarioSchema<T>): Scenario;
  scenario(name: string, ...step: ScenarioSchema<undefined>): Scenario;
}