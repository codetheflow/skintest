import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, ClientStep, DevStep, DoStep, InfoStep, TestStep } from './command';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Query, QueryList } from './query';
import { RecipeFunction } from './recipe';
import { Breakpoint } from './steps/debug';
import { ThatFunction } from './that';

export interface Ego {
  __pause(): DevStep;
  __debug(breakpoint: Breakpoint): DevStep;
  __inspect<E extends DOMElement>(selector: string | Query<E> | QueryList<E>): DevStep;

  open(name: string): ClientStep;
  goto(url: string): ClientStep;
  navigate(direction: 'back' | 'forward'): ClientStep;
  reload(): ClientStep;
  wait<F extends ThatFunction>(recipe: F, ...args: Parameters<F>): ClientStep;
  wait<E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: V): ClientStep;
  wait<E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: V): ClientStep;

  // todo: make more explicit `E` types
  mark<E extends HTMLInputElement>(target: Query<E>, value: 'checked' | 'unchecked'): ClientStep;
  click<E extends DOMElement>(target: Query<E>): ClientStep;
  dblclick<E extends DOMElement>(target: Query<E>): ClientStep;
  fill<E extends HTMLInputElement | HTMLAreaElement>(target: Query<E>, value: string): ClientStep;
  focus<E extends DOMElement>(target: Query<E>): ClientStep;
  hover<E extends DOMElement>(target: Query<E>): ClientStep;
  press(key: KeyboardKey): ClientStep;
  say(message: string): InfoStep;
  type<E extends HTMLInputElement | HTMLAreaElement>(target: Query<E>, value: string): ClientStep;
  select<E extends DOMElement>(target: Query<E>): ClientStep;

  do<F extends RecipeFunction>(recipe: F, ...args: Parameters<F>): DoStep;

  test(message: string): TestStep;
  see<F extends ThatFunction>(recipe: F, ...args: Parameters<F>): AssertStep;
  see<E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: V): AssertStep;

}