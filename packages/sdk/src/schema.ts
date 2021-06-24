import { AssertStep, CheckStep, ClientStep, ControlStep, DevStep, DoStep, InfoStep } from './command';

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