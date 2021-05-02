import { BinaryAssert, ListAssert, UnaryAssert } from './assert';
import { Do } from './recipe';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Query, QueryList } from './query';
import { AssertStep, CheckStep, DevStep, SayStep, UIStep } from './command';
import { AmOnPageStep } from './steps/am-on-page';
import { AttachFileStep } from './steps/attach-file';
import { Breakpoint, DebugStep } from './steps/debug';
import { CheckWhatStep } from './steps/check';
import { ClickStep } from './steps/click';
import { DontSeeStep } from './steps/dont-see';
import { DoStep } from './steps/do';
import { DragStep } from './steps/drag';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { InspectStep } from './steps/inspect';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { SeeStep } from './steps/see';
import { TalkStep } from './steps/say';
import { WaitUrlStep } from './steps/wait-url';

export interface Ego {
  check(what: string): CheckStep;

  see<S extends DOMElement>(target: Query<S>): AssertStep;
  see<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  see<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;

  // dontSee<S extends DOMElement>(target: Query<S>): AssertStep;
  // dontSee<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  // dontSee<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  // dontSee<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;

  do(action: () => Do): UIStep;
  do<A>(action: (arg: A) => Do, arg: A): UIStep;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => Do, arg1: A1, arg2: A2): UIStep;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => Do, arg1: A1, arg2: A2, arg3: A3): UIStep;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Do, arg1: A1, arg2: A2, arg3: A3, arg4: A4): UIStep;

  amOnPage(url: string): UIStep;
  attachFile(from: Query<HTMLFormElement>, file: any): UIStep;
  click<S extends DOMElement>(target: Query<S>): UIStep;
  drag<S extends DOMElement>(target: Query<S>, x: number, y: number): UIStep;
  fill<S extends DOMElement, V>(target: Query<S>, value: V): UIStep;
  focus<S extends DOMElement>(target: Query<S>): UIStep;
  say(message: string): SayStep;

  press(key: KeyboardKey): UIStep;

  waitUrl(url: string): UIStep;

  pause(): DevStep;
  debug(breakpoint: Breakpoint): DevStep;
  inspect<T extends DOMElement>(selector: string | Query<T> | QueryList<T>): DevStep;
}

class MyEgo implements Ego {
  check(what: string): CheckStep {
    return new CheckWhatStep(what);
  }

  see<S extends DOMElement>(target: Query<S>): AssertStep;
  see<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  see<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;
  see(targets: any, assert?: any, value?: any): AssertStep {
    return new SeeStep(targets, assert, value);
  }

  dontSee<S extends DOMElement>(target: Query<S>): AssertStep;
  dontSee<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  dontSee<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  dontSee<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;
  dontSee(targets: any, assert?: any, value?: any): AssertStep {
    return new DontSeeStep(targets, assert, value);
  }

  do(action: () => Do): UIStep;
  do<A>(action: (arg: A) => Do, arg: A): UIStep;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => Do, arg1: A1, arg2: A2): UIStep;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => Do, arg1: A1, arg2: A2, arg3: A3): UIStep;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Do, arg1: A1, arg2: A2, arg3: A3, arg4: A4): UIStep;
  do(action: any, ...args: any[]): UIStep {
    return new DoStep(action, args);
  }

  amOnPage(url: string): UIStep {
    return new AmOnPageStep(url);
  }

  waitUrl(url: string): UIStep {
    return new WaitUrlStep(url);
  }

  click<S extends DOMElement>(target: Query<S>): UIStep {
    return new ClickStep(target);
  }

  press(key: KeyboardKey): UIStep {
    return new PressStep(key);
  }

  fill<S extends DOMElement, V>(target: Query<S>, value: V): UIStep {
    return new FillStep(target, '' + value);
  }

  focus<S extends DOMElement>(target: Query<S>): UIStep {
    return new FocusStep(target);
  }

  drag<S extends DOMElement>(target: Query<S>, x: number, y: number): UIStep {
    return new DragStep(target, x, y);
  }

  attachFile(from: Query<HTMLFormElement>, file: any): UIStep {
    return new AttachFileStep(from, file);
  }

  say(message: string): SayStep {
    return new TalkStep(message);
  }

  debug(breakpoint: Breakpoint): DevStep {
    return new DebugStep(breakpoint)
  }

  inspect<T extends DOMElement>(selector: string | Query<T> | QueryList<T>): DevStep {
    return new InspectStep(selector);
  }

  pause(): DevStep {
    return new PauseStep();
  }
}

export const I: Ego = new MyEgo();