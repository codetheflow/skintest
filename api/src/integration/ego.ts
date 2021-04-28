import { Assert, AssertAll } from './assert';
import { Do } from './recipe';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Select, SelectAll } from './selector';
import { Step } from './step';

import { AmOnPageStep } from './steps/am-on-page';
import { AttachFileStep } from './steps/attach-file';
import { Breakpoint, DebugStep } from './steps/debug';
import { ClickStep } from './steps/click';
import { DontSeeStep } from './steps/dont-see';
import { DoStep } from './steps/do';
import { DragStep } from './steps/drag';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { InspectStep } from './steps/inspect';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { SayStep } from './steps/say';
import { SeeStep } from './steps/see';
import { WaitUrlStep } from './steps/wait-url';

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

  debug(breakpoint: Breakpoint): Step;
  inspect<T extends DOMElement>(selector: string | Select<T> | SelectAll<T>): Step;
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

  debug(breakpoint: Breakpoint): Step {
    return new DebugStep(breakpoint)
  }

  inspect<T extends DOMElement>(selector: string | Select<T> | SelectAll<T>) {
    return new InspectStep(selector);
  }

  pause(): Step {
    return new PauseStep();
  }
}

export const I: Ego = new MyEgo();