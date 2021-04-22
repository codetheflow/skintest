import { Do } from './recipe';
import { Select } from './selector';
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

export interface Ego {
  see(that: boolean): Step;
  see<S>(target: Select<S>): Step;
  see<S, E>(target: Select<S>, expected: E): Step;
  see<V>(actual: V, expected: V): Step;

  dontSee(that: boolean): Step;
  dontSee<S>(target: Select<S>): Step;
  dontSee<S, E>(target: Select<S>, expected: E): Step;

  do(action: () => Do): Step;
  do<A>(action: (arg: A) => Do, arg: A): Step;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => Do, arg1: A1, arg2: A2): Step;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => Do, arg1: A1, arg2: A2, arg3: A3): Step;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Do, arg1: A1, arg2: A2, arg3: A3, arg4: A4): Step;

  amOnPage(url: string): Step;
  attachFile(from: Select<HTMLFormElement>, file: any): Step;
  click<S>(target: Select<S>): Step;
  drag<S>(target: Select<S>, x: number, y: number): Step;
  fill<S, V>(target: Select<S>, value: V): Step;
  focus<S>(target: Select<S>): Step;
  say(message: string): Step;

  press(key: KeyboardKey): Step;

  waitUrl(url: string): Step;
  pause(): Step;
}

class MyEgo implements Ego {
  see(that: boolean): Step;
  see<S>(target: Select<S>): Step;
  see<S, E>(target: Select<S>, expected: E): Step;
  see(target: any, expected?: any): Step {
    return new SeeStep(target, expected);
  }

  dontSee(that: boolean): Step;
  dontSee<S>(target: Select<S>): Step;
  dontSee<S, E>(target: Select<S>, expected: E): Step;
  dontSee(target: any, expected?: any): Step {
    return new DontSeeStep(target, expected);
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

  click<S>(target: Select<S>): Step {
    return new ClickStep(target);
  }

  press(key: KeyboardKey): Step {
    return new PressStep(key);
  }

  fill<S, V>(target: Select<S>, value: V): Step {
    return new FillStep(target, '' + value);
  }

  focus<S>(target: Select<S>): Step {
    return new FocusStep(target);
  }

  drag<S>(target: Select<S>, x: number, y: number): Step {
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