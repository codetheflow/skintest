import { AssertStep, CheckStep, DevStep, DoStep, InfoStep, ClientStep } from './command';

export type UIStep = ClientStep | DoStep | DevStep | InfoStep;
export type VerifyStep = AssertStep | DevStep | InfoStep;

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


