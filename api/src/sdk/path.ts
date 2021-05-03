import { AssertStep, CheckStep, DevStep, DoStep, SayStep, ClientStep } from './command';

export type UIStep = ClientStep | DoStep | DevStep | SayStep;
export type VerifyStep = AssertStep | DevStep | SayStep;

export type Path =
  [...Array<UIStep>, CheckStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep]
  | [...Array<UIStep>, CheckStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep, VerifyStep];


