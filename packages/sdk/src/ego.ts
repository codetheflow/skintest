import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, ClientStep, DevStep, DoStep, InfoStep, TestStep } from './command';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Query, QueryList } from './query';
import { ClientFunction, ClientRecipe, ServerFunction, ServerRecipe } from './recipe';
import { Breakpoint } from './steps/debug';


export interface Ego {
  __pause(): DevStep;
  __debug(breakpoint: Breakpoint): DevStep;
  __inspect<T extends DOMElement>(selector: string | Query<T> | QueryList<T>): DevStep;

  open(name: string): ClientStep;
  goto(url: string): ClientStep;
  navigate(direction: 'back' | 'forward'): ClientStep;
  reload(): ClientStep;
  wait(url: string): ClientStep;

  do<T extends ClientFunction>(recipe: ClientRecipe<T>, ...args: Parameters<T>): DoStep
  do<T extends ServerFunction>(recipe: ServerRecipe<T>, ...args: Parameters<T>): DoStep

  test(message: string): TestStep;
  see<E extends DOMElement>(target: Query<E>): AssertStep;
  see<E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: V): AssertStep;

  // todo: make more explicit `E` types
  mark<E extends DOMElement>(target: Query<E>, value: 'checked' | 'unchecked'): ClientStep;
  click<E extends DOMElement>(target: Query<E>): ClientStep;
  dblclick<E extends DOMElement>(target: Query<E>): ClientStep;
  fill<E extends DOMElement>(target: Query<E>, value: string): ClientStep;
  focus<E extends DOMElement>(target: Query<E>): ClientStep;
  hover<E extends DOMElement>(target: Query<E>): ClientStep;
  press(key: KeyboardKey): ClientStep;
  say(message: string): InfoStep;
  type<E extends DOMElement>(target: Query<E>, value: string): ClientStep;
  select<E extends DOMElement>(target: Query<E>): ClientStep;
}