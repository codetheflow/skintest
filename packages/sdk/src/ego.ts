import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, CheckStep, ClientStep, DevStep, DoStep, InfoStep } from './command';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Query, QueryList } from './query';
import { RecipeFunction0, RecipeFunction1, RecipeFunction2, RecipeFunction3, RecipeFunction4 } from './recipe';
import { Breakpoint } from './steps/debug';
import { ThatFunction0, ThatFunction1, ThatFunction2, ThatFunction3, ThatFunction4 } from './that';

export type Data<V, T> = V | {
  key: keyof T,
};

export interface Ego {
  __pause<D>(): DevStep<D>;
  __debug<D>(breakpoint: Breakpoint): DevStep<D>;
  __inspect<D, E extends DOMElement>(selector: string | Query<E> | QueryList<E>): DevStep<D>;

  open<D>(name: Data<string, D>): ClientStep<D>;
  goto<D>(url: Data<string, D>): ClientStep<D>;
  navigate<D>(direction: 'back' | 'forward'): ClientStep<D>;
  reload<D>(): ClientStep<D>;

  wait<D, E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: Data<V, D>): ClientStep<D>;
  wait<D, E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: Data<V, D>): ClientStep<D>;
  wait<D>(that: ThatFunction0): ClientStep<D>;
  wait<D, A1>(that: ThatFunction1<A1>, arg1: Data<A1, D>): ClientStep<D>;
  wait<D, A1, A2>(that: ThatFunction2<A1, A2>, arg1: Data<A1, D>, arg2: Data<A2, D>): ClientStep<D>;
  wait<D, A1, A2, A3>(that: ThatFunction3<A1, A2, A3>, arg1: Data<A1, D>, arg2: Data<A2, D>, arg3: Data<A3, D>): ClientStep<D>;
  wait<D, A1, A2, A3, A4>(that: ThatFunction4<A1, A2, A3, A4>, arg1: Data<A1, D>, arg2: Data<A2, D>, arg3: Data<A3, D>, arg4: Data<A4, D>): ClientStep<D>;

  // todo: make more explicit `E` types
  mark<D, E extends HTMLInputElement>(target: Query<E>, state: Data<'checked' | 'unchecked', D>): ClientStep<D>;
  click<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  dblclick<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  fill<D, E extends HTMLInputElement | HTMLAreaElement>(target: Query<E>, text: Data<string, D>): ClientStep<D>;
  focus<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  hover<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  press<D>(key: Data<KeyboardKey, D>): ClientStep<D>;
  say<D>(message: Data<string, D>): InfoStep<D>;
  type<D, E extends HTMLInputElement | HTMLAreaElement>(target: Query<E>, text: Data<string, D>): ClientStep<D>;
  select<D, E extends DOMElement>(what: 'text', target: Query<E>): ClientStep<D>;

  do<D>(recipe: RecipeFunction0): DoStep<D>;
  do<D, A1>(recipe: RecipeFunction1<A1>, arg1: Data<A1, D>): DoStep<D>;
  do<D, A1, A2>(recipe: RecipeFunction2<A1, A2>, arg1: Data<A1, D>, arg2: Data<A2, D>): DoStep<D>;
  do<D, A1, A2, A3>(recipe: RecipeFunction3<A1, A2, A3>, arg1: Data<A1, D>, arg2: Data<A2, D>, arg3: Data<A3, D>): DoStep<D>;
  do<D, A1, A2, A3, A4>(recipe: RecipeFunction4<A1, A2, A3, A4>, arg1: Data<A1, D>, arg2: Data<A2, D>, arg3: Data<A3, D>, arg4: Data<A4, D>): DoStep<D>;

  check<D>(message: Data<string, D>): CheckStep<D>;

  // todo: make binary assert type better

  see<D, V, E extends DOMElement>(target: Query<E>, has: BinaryAssert<Data<V, D>>, value: Data<V, D>): AssertStep<D>;
  see<D, V, E extends DOMElement>(targets: QueryList<E>, has: ListBinaryAssert<Data<V, D>>, value: Data<V, D>): AssertStep<D>;
  see<D>(that: ThatFunction0): AssertStep<D>;
  see<D, A1>(that: ThatFunction1<A1>, arg1: Data<A1, D>): AssertStep<D>;
  see<D, A1, A2>(that: ThatFunction2<A1, A2>, arg1: Data<A1, D>, arg2: Data<A2, D>): AssertStep<D>;
  see<D, A1, A2, A3>(that: ThatFunction3<A1, A2, A3>, arg1: Data<A1, D>, arg2: Data<A2, D>, arg3: Data<A3, D>): AssertStep<D>;
  see<D, A1, A2, A3, A4>(that: ThatFunction4<A1, A2, A3, A4>, arg1: Data<A1, D>, arg2: Data<A2, D>, arg3: Data<A3, D>, arg4: Data<A4, D>): AssertStep<D>;
}