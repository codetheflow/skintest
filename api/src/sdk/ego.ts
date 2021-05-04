import { ActionStep } from './steps/action';
import { AmOnPageStep } from './steps/am-on-page';
import { AssertStep, CheckStep, DevStep, InfoStep, DoStep, ClientStep } from './command';
import { AttachFileStep } from './steps/attach-file';
import { BinaryAssert, ListAssert, UnaryAssert } from './assert';
import { Breakpoint, DebugStep } from './steps/debug';
import { CheckWhatStep } from './steps/check';
import { ClickStep } from './steps/click';
import { ClientDo, ClientFunction, ClientRecipe, ServerDo, ServerFunction, ServerRecipe } from './recipe';
import { DOMElement } from './dom';
import { DontSeeStep } from './steps/dont-see';
import { DragStep } from './steps/drag';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { HoverStep } from './steps/hover';
import { InspectStep } from './steps/inspect';
import { KeyboardKey } from './keyboard';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { Query, QueryList } from './query';
import { SayStep } from './steps/say';
import { SeeStep } from './steps/see';
import { WaitUrlStep } from './steps/wait-url';

export interface Ego {
  pause(): DevStep;
  debug(breakpoint: Breakpoint): DevStep;
  inspect<T extends DOMElement>(selector: string | Query<T> | QueryList<T>): DevStep;

  check(what: string): CheckStep;
  see<S extends DOMElement>(target: Query<S>): AssertStep;
  see<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  see<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;
  // dontSee<S extends DOMElement>(target: Query<S>): AssertStep;
  // dontSee<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  // dontSee<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  // dontSee<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;

  do<T extends ClientFunction>(recipe: ClientRecipe<T>, ...args: Parameters<T>): DoStep
  do<T extends ServerFunction>(recipe: ServerRecipe<T>, ...args: Parameters<T>): DoStep

  amOnPage(url: string): ClientStep;
  attachFile(from: Query<HTMLFormElement>, file: any): ClientStep;
  drag<S extends DOMElement>(target: Query<S>, x: number, y: number): ClientStep;
  click<S extends DOMElement>(target: Query<S>): ClientStep;
  hover<S extends DOMElement>(target: Query<S>): ClientStep;
  fill<S extends DOMElement, V>(target: Query<S>, value: V): ClientStep;
  focus<S extends DOMElement>(target: Query<S>): ClientStep;
  say(message: string): InfoStep;
  press(key: KeyboardKey): ClientStep;
  waitUrl(url: string): ClientStep;
}

class MyEgo implements Ego {
  do<T extends (...args: any) => ClientDo>(recipe: ClientRecipe<T>, ...args: Parameters<T>): DoStep;
  do<T extends (...args: any) => ServerDo>(recipe: ServerRecipe<T>, ...args: Parameters<T>): DoStep;
  do(recipe: any, args?: any[]) {
    return new ActionStep(recipe, args || []);
  }

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

  // dontSee<S extends DOMElement>(target: Query<S>): AssertStep;
  // dontSee<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  // dontSee<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  // dontSee<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;
  // dontSee(targets: any, assert?: any, value?: any): AssertStep {
  //   return new DontSeeStep(targets, assert, value);
  // }

  amOnPage(url: string): ClientStep {
    return new AmOnPageStep(url);
  }

  waitUrl(url: string): ClientStep {
    return new WaitUrlStep(url);
  }

  click<S extends DOMElement>(target: Query<S>): ClientStep {
    return new ClickStep(target);
  }

  hover<S extends DOMElement>(target: Query<S>): ClientStep {
    return new HoverStep(target);
  }

  press(key: KeyboardKey): ClientStep {
    return new PressStep(key);
  }

  fill<S extends DOMElement, V>(target: Query<S>, value: V): ClientStep {
    return new FillStep(target, '' + value);
  }

  focus<S extends DOMElement>(target: Query<S>): ClientStep {
    return new FocusStep(target);
  }

  drag<S extends DOMElement>(target: Query<S>, x: number, y: number): ClientStep {
    return new DragStep(target, x, y);
  }

  attachFile(from: Query<HTMLFormElement>, file: any): ClientStep {
    return new AttachFileStep(from, file);
  }

  say(message: string): InfoStep {
    return new SayStep(message);
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