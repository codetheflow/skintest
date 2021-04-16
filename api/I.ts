import { MyDefinition } from './definition';
import { MyStep } from './my-step';
import { Selector } from './selector';

export interface Ego {
  do(action: () => MyDefinition): MyStep;
  do<A>(action: (arg: A) => MyDefinition, arg: A): MyStep;
  do<A1, A2>(action: (arg1: A1, arg2: A2) => MyDefinition, arg1: A1, arg2: A2): MyStep;
  do<A1, A2, A3>(action: (arg1: A1, arg2: A2, arg3: A3) => MyDefinition, arg1: A1, arg2: A2, arg3: A3): MyStep;
  do<A1, A2, A3, A4>(action: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => MyDefinition, arg1: A1, arg2: A2, arg3: A3, arg4: A4): MyStep;

  amOnPage(url: string): MyStep;
  waitUrl(url: string): MyStep;

  click<S>(target: Selector<S>): MyStep;
  press(key: string): MyStep;
  fill<S, V>(target: Selector<S>, value: V): MyStep;
  focus<S>(target: S): MyStep;

  // TODO: define file type
  attachFile(from: Selector<HTMLFormElement>, file: any): MyStep;

  see<S, E>(target: Selector<S> | boolean, expected?: E): MyStep;
  dontSee<S, E>(target: Selector<S> | boolean, expected?: E): MyStep;

  say(message: string): MyStep;
}

// TODO: implement
export const I: Ego = null;