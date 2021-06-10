import { AssertStep, ClientStep, ControlStep, DevStep, DoStep, InfoStep, TestStep } from './command';

export type StoryStep = ClientStep | DoStep | DevStep | InfoStep;
export type VerifyStep = AssertStep | DevStep;
export type ControlFlowStep = ControlStep | DevStep;

export type StorySchema = StoryStep[];
export type VerifySchema = VerifyStep[];

type WithVerifySchema<AFTER> =
  [...StorySchema, AFTER, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, AFTER, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep];

export type ScenarioSchema = WithVerifySchema<TestStep>;
export type PerformSchema = [...StorySchema] | WithVerifySchema<ControlFlowStep>;