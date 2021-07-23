import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, CheckStep, ClientStep, DevStep, DoStep, InfoStep } from './command';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Query, QueryList } from './query';
import { Breakpoint } from './steps/debug';
import { TaskFunction0, TaskFunction1, TaskFunction2, TaskFunction3, TaskFunction4 } from './task';
import { ThatFunction0, ThatFunction1, ThatFunction2, ThatFunction3, ThatFunction4 } from './that';
import { Value } from './value';

export interface Ego {
  __pause<D>(): DevStep<D>;
  __debug<D>(breakpoint: Breakpoint): DevStep<D>;

  open<D>(name: Value<string, D>): ClientStep<D>;
  goto<D>(url: Value<string, D>): ClientStep<D>;
  navigate<D>(direction: Value<'back' | 'forward', D>): ClientStep<D>;
  reload<D>(): ClientStep<D>;

  wait<D, E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: Value<V, D>): ClientStep<D>;
  wait<D, E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: Value<V, D>): ClientStep<D>;
  wait<D>(that: ThatFunction0): ClientStep<D>;
  wait<D, T1>(that: ThatFunction1<T1>, arg1: Value<T1, D>): ClientStep<D>;
  wait<D, T1, T2>(that: ThatFunction2<T1, T2>, arg1: Value<T1, D>, arg2: Value<T2, D>): ClientStep<D>;
  wait<D, T1, T2, T3>(that: ThatFunction3<T1, T2, T3>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>): ClientStep<D>;
  wait<D, T1, T2, T3, T4>(that: ThatFunction4<T1, T2, T3, T4>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>, arg4: Value<T4, D>): ClientStep<D>;

  // todo: make more explicit `E` types
  mark<D, E extends HTMLInputElement>(target: Query<E>, state: Value<'checked' | 'unchecked', D>): ClientStep<D>;
  click<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  dblclick<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  fill<D, E extends HTMLInputElement | HTMLAreaElement>(target: Query<E>, text: Value<string, D>): ClientStep<D>;
  focus<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  hover<D, E extends DOMElement>(target: Query<E>): ClientStep<D>;
  press<D>(key: Value<KeyboardKey, D>): ClientStep<D>;
  say<D>(message: Value<string, D>): InfoStep<D>;
  type<D, E extends HTMLInputElement | HTMLAreaElement>(target: Query<E>, text: Value<string, D>): ClientStep<D>;
  select<D, E extends DOMElement>(what: 'text', target: Query<E>): ClientStep<D>;

  do<D>(task: TaskFunction0): DoStep<D>;
  do<D, T1>(task: TaskFunction1<T1>, arg1: Value<T1, D>): DoStep<D>;
  do<D, T1, T2>(task: TaskFunction2<T1, T2>, arg1: Value<T1, D>, arg2: Value<T2, D>): DoStep<D>;
  do<D, T1, T2, T3>(task: TaskFunction3<T1, T2, T3>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>): DoStep<D>;
  do<D, T1, T2, T3, T4>(task: TaskFunction4<T1, T2, T3, T4>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>, arg4: Value<T4, D>): DoStep<D>;

  check<D>(message: Value<string, D>): CheckStep<D>;

  // todo: make binary assert type better

  see<D, V, E extends DOMElement>(target: Query<E>, has: BinaryAssert<Value<V, D>>, value: Value<V, D>): AssertStep<D>;
  see<D, V, E extends DOMElement>(targets: QueryList<E>, has: ListBinaryAssert<Value<V, D>>, value: Value<V, D>): AssertStep<D>;
  see<D>(that: ThatFunction0): AssertStep<D>;
  see<D, T1>(that: ThatFunction1<T1>, arg1: Value<T1, D>): AssertStep<D>;
  see<D, T1, T2>(that: ThatFunction2<T1, T2>, arg1: Value<T1, D>, arg2: Value<T2, D>): AssertStep<D>;
  see<D, T1, T2, T3>(that: ThatFunction3<T1, T2, T3>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>): AssertStep<D>;
  see<D, T1, T2, T3, T4>(that: ThatFunction4<T1, T2, T3, T4>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>, arg4: Value<T4, D>): AssertStep<D>;
}