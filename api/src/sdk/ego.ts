import { BinaryAssert, ListAssert, UnaryAssert } from './assert';
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
  see<E extends DOMElement>(target: Query<E>, assert: UnaryAssert): AssertStep;
  see<E extends DOMElement, V>(target: Query<E>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(targets: QueryList<E>, assert: ListAssert<V>, value: V): AssertStep;
  // dontSee<S extends DOMElement>(target: Query<S>): AssertStep;
  // dontSee<S extends DOMElement>(target: Query<S>, assert: UnaryAssert): AssertStep;
  // dontSee<S extends DOMElement, V>(target: Query<S>, assert: BinaryAssert<V>, value: V): AssertStep;
  // dontSee<S extends DOMElement, V>(targets: QueryList<S>, assert: ListAssert<V>, value: V): AssertStep;

  // todo: make more explicit `E` types
  check<E extends DOMElement>(target: Query<E>): ClientStep;
  click<E extends DOMElement>(target: Query<E>): ClientStep;
  dblclick<E extends DOMElement>(target: Query<E>): ClientStep;
  fill<E extends DOMElement>(target: Query<E>, value: string): ClientStep;
  focus<E extends DOMElement>(target: Query<E>): ClientStep;
  hover<E extends DOMElement>(target: Query<E>): ClientStep;
  press(key: KeyboardKey): ClientStep;
  say(message: string): InfoStep;
  type<E extends DOMElement>(target: Query<E>, value: string): ClientStep;
  uncheck<E extends DOMElement>(target: Query<E>): ClientStep;

  // select<E extends DOMElement>(target: Query<E>, option: string): ClientStep;
  // attachFile(from: Query<HTMLFormElement>, file: any): ClientStep;
  // drag<S extends DOMElement>(target: Query<S>, x: number, y: number): ClientStep;
}
