import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, ClientStep, DevStep, DoStep, InfoStep, TestStep } from './command';
import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { Query, QueryList } from './query';
import { ClientFunction, ClientRecipe } from './recipes/client';
import { ServerFunction, ServerRecipe } from './recipes/server';
import { ThatFunction, ThatRecipe } from './recipes/that';
import { Breakpoint } from './steps/debug';

export interface Ego {
  __pause(): DevStep;
  __debug(breakpoint: Breakpoint): DevStep;
  __inspect<E extends DOMElement>(selector: string | Query<E> | QueryList<E>): DevStep;

  open(name: string): ClientStep;
  goto(url: string): ClientStep;
  navigate(direction: 'back' | 'forward'): ClientStep;
  reload(): ClientStep;
  wait(what: 'url', url: string | RegExp): ClientStep;

  do<A extends ClientFunction>(recipe: ClientRecipe<A>, ...args: Parameters<A>): DoStep
  do<A extends ServerFunction>(recipe: ServerRecipe<A>, ...args: Parameters<A>): DoStep

  test(message: string): TestStep;
  see<A extends ThatFunction>(recipe: ThatRecipe<A>, ...args: Parameters<A>): AssertStep;
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