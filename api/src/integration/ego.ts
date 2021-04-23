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
import { Has, HasMany } from './has';

export interface Ego {
  see<S>(target: Select<S>): Step;
  see<S, V>(target: Select<S>, has: Has<V>, value: V): Step;
  see<S, V>(targets: SelectAll<S>, has: HasMany<V>, value: V): Step;

  dontSee<S>(target: Select<S>): Step;
  dontSee<S, V>(target: Select<S>, has: Has<V>, value: V): Step;
  dontSee<S, V>(targets: SelectAll<S>, has: HasMany<V>, value: V): Step;

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
  see<S>(target: Select<S>): Step;
  see<S, V>(target: Select<S>, has: Has<V>, value: V): Step;
  see<S, V>(targets: SelectAll<S>, has: HasMany<V>, value: V): Step;
  see(targets: any, has?: any, value?: any): Step {
    throw new Error('Method not implemented.');
  }

  dontSee<S>(target: Select<S>): Step;
  dontSee<S, V>(target: Select<S>, has: Has<V>, value: V): Step;
  dontSee<S, V>(targets: SelectAll<S>, has: HasMany<V>, value: V): Step;
  dontSee(targets: any, has?: any, value?: any):  Step {
    throw new Error('Method not implemented.');
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