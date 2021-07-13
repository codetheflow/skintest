import { Data, getCaller, getMeta } from '@skintest/common';
import { AssertStep, CheckStep, ClientStep, Command, ControlStep, DevStep, DoStep, InfoStep } from './command';
import { RuntimeScript } from './script';

export const schema = {
  get dev(): Feature {
    const caller = getCaller();
    const script = new RuntimeScript(`feature-dev-${Date.now()}`, () => getMeta(caller));
    return script;
  },

  get strict(): StrictFeature {
    const caller = getCaller();
    const script = new RuntimeScript(`feature-strict-${Date.now()}`, () => getMeta(caller));
    return script;
  }
};


export interface Feature extends TestScenario {
  before(what: 'feature' | 'scenario' | 'step', ...step: Command[]): Feature;
  after(what: 'feature' | 'scenario' | 'step', ...step: Command[]): Feature;
}

export interface OnlyScenario<T = undefined> {
  scenario(name: string, ...step: Command<T>[]): TestScenario;
}

export interface TestScenario {
  test<T extends Data>(frame: 'data', ...data: T[]): OnlyScenario<T>;
  scenario(name: string, ...step: Command[]): TestScenario;
}

export interface StrictFeature extends StrictTestScenario {
  before(what: 'feature' | 'scenario' | 'step', ...step: StorySchema<undefined>): StrictFeature;
  after(what: 'feature' | 'scenario' | 'step', ...step: StorySchema<undefined>): StrictFeature;
}

export interface StrictOnlyScenario<T = undefined> extends OnlyScenario<T> {
  scenario(name: string, ...step: ScenarioSchema<T>): TestScenario;
}

export interface StrictTestScenario extends TestScenario {
  scenario(name: string, ...step: ScenarioSchema<undefined>): TestScenario;
}

export type StoryStep<D> = ClientStep<D> | DoStep<D> | InfoStep<D> | DevStep<D>;
export type VerifyStep<D> = AssertStep<D> | DevStep<D>;
export type ControlFlowStep<D> = ControlStep<D> | DevStep<D>;

export type StorySchema<D> = StoryStep<D>[];

type FlowSchema<D, AFTER> =
  [...StorySchema<D>, AFTER, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>]
  | [...StorySchema<D>, AFTER, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>, VerifyStep<D>];

export type ScenarioSchema<D> = FlowSchema<D, CheckStep<D>>;
export type PerformSchema<D> = [...StorySchema<D>] | FlowSchema<D, ControlFlowStep<D>>;