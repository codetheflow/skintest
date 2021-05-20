import { AssertStep, TestStep, DevStep, DoStep, InfoStep, ClientStep } from './command';

export type StoryStep = ClientStep | DoStep | DevStep | InfoStep;
export type VerifyStep = AssertStep | DevStep | InfoStep;

export type StorySchema = StoryStep[];
export type ScenarioSchema =
  [...StorySchema, TestStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep];