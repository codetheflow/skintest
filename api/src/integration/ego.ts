import { Do } from './recipe';
import { Select, SelectAll } from './selector';
import { Step } from './step';
import {
  AmOnPageStep,
  AttachFileStep,
  ClickStep,
  DoStep,
  DontSeeStep,
  DragStep,
  FillStep,
  FocusStep,
  PressStep,
  SayStep,
  SeeStep,
  WaitUrlStep,
  PauseStep
} from './step-bag';
import { KeyboardKey } from './keyboard';
import { Assert, AssertAll } from './assert';
import { DOMElement } from '../platform/dom';

export interface Ego {
  see<S extends DOMElement>(target: Select<S>): Step;
  see<S extends DOMElement, V>(target: Select<S>, assert: Assert<V>, value: V): Step;
  see<S extends DOMElement, V>(targets: SelectAll<S>, assert: AssertAll<V>, value: V): Step;

  dontSee<S extends DOMElement>(target: Select<S>): Step;
  dontSee<S extends DOMElement, V>(target: Select<S>, assert: Assert<V>, value: V): Step;
  dontSee<S extends DOMElement, V>(targets: SelectAll<S>, assert: AssertAll<V>, value: V): Step;

  do(action: () => Do): Step;
  do<A>(action: (arg: A) => Do, arg: A): Step;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => Do, arg1: A1, arg2: A2): Step;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => Do, arg1: A1, arg2: A2, arg3: A3): Step;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Do, arg1: A1, arg2: A2, arg3: A3, arg4: A4): Step;

  amOnPage(url: string): Step;
  attachFile(from: Select<HTMLFormElement>, file: any): Step;
  click<S extends DOMElement>(target: Select<S>): Step;
  drag<S extends DOMElement>(target: Select<S>, x: number, y: number): Step;
  fill<S extends DOMElement, V>(target: Select<S>, value: V): Step;
  focus<S extends DOMElement>(target: Select<S>): Step;
  say(message: string): Step;

  press(key: KeyboardKey): Step;

  waitUrl(url: string): Step;
  pause(): Step;
}

class MyEgo implements Ego {
  see<S extends DOMElement>(target: Select<S>): Step;
  see<S extends DOMElement, V>(target: Select<S>, assert: Assert<V>, value: V): Step;
  see<S extends DOMElement, V>(targets: SelectAll<S>, assert: AssertAll<V>, value: V): Step;
  see(targets: any, assert?: any, value?: any): Step {
   return new SeeStep(targets, assert, value);
  }

  dontSee<S extends DOMElement>(target: Select<S>): Step;
  dontSee<S extends DOMElement, V>(target: Select<S>, assert: Assert<V>, value: V): Step;
  dontSee<S extends DOMElement, V>(targets: SelectAll<S>, assert: AssertAll<V>, value: V): Step;
  dontSee(targets: any, assert?: any, value?: any): Step {
    return new DontSeeStep(targets, assert, value);
  }

  do(action: () => Do): Step;
  do<A>(action: (arg: A) => Do, arg: A): Step;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => Do, arg1: A1, arg2: A2): Step;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => Do, arg1: A1, arg2: A2, arg3: A3): Step;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Do, arg1: A1, arg2: A2, arg3: A3, arg4: A4): Step;
  do(action: any, ...args: any[]): Step {
    return new DoStep(action, args);
  }

  amOnPage(url: string): Step {
    return new AmOnPageStep(url);
  }

  waitUrl(url: string): Step {
    return new WaitUrlStep(url);
  }

  pause(): Step {
    return new PauseStep();
  }

  click<S extends DOMElement>(target: Select<S>): Step {
    return new ClickStep(target);
  }

  press(key: KeyboardKey): Step {
    return new PressStep(key);
  }

  fill<S extends DOMElement, V>(target: Select<S>, value: V): Step {
    return new FillStep(target, '' + value);
  }

  focus<S extends DOMElement>(target: Select<S>): Step {
    return new FocusStep(target);
  }

  drag<S extends DOMElement>(target: Select<S>, x: number, y: number): Step {
    return new DragStep(target, x, y);
  }

  attachFile(from: Select<HTMLFormElement>, file: any): Step {
    return new AttachFileStep(from, file);
  }

  say(message: string): Step {
    return new SayStep(message);
  }
}

export const I: Ego = new MyEgo();