import { MyDefinition } from './definition';
import { MyStep } from './my-step';
import { Select } from './selector';

export interface Ego {
  do(action: () => MyDefinition): MyStep;
  do<A>(action: (arg: A) => MyDefinition, arg: A): MyStep;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => MyDefinition, arg1: A1, arg2: A2): MyStep;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => MyDefinition, arg1: A1, arg2: A2, arg3: A3): MyStep;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => MyDefinition, arg1: A1, arg2: A2, arg3: A3, arg4: A4): MyStep;

  amOnPage(url: string): MyStep;
  waitUrl(url: string): MyStep;

  click<S>(target: Select<S>): MyStep;
  press(key: string): MyStep;
  fill<S, V>(target: Select<S>, value: V): MyStep;
  focus<S>(target: S): MyStep;
  drag<S>(target: S, x: number, y: number): MyStep

  // TODO: define file type
  attachFile(from: Select<HTMLFormElement>, file: any): MyStep;

  see<T>(target: Select<T> | T, expected?: T): MyStep;
  dontSee<T>(target: Select<T> | T, expected?: T): MyStep;

  say(message: string): MyStep;
}

// TODO: implement
export const I: Ego = null;