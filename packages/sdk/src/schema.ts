import { AssertStep, ClientStep, DevStep, DoStep, InfoStep, TestStep } from './command';

export type StoryStep = ClientStep | DoStep | DevStep | InfoStep;
export type VerifyStep = AssertStep | DevStep;

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
  | [...StorySchema, TestStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep];


export type ConditionSchema =
  [VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema]
  | [VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, InfoStep, ...StorySchema];