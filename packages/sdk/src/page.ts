import { DOMElement } from './dom';
import { KeyboardKey } from './keyboard';
import { ClientElement } from './recipe';

export interface ElementRef<E extends DOMElement> extends ClientElement<E> {
  innerText(): Promise<string>;
  value(): Promise<string>;
  hasFocus(): Promise<boolean>;
}

export type ElementRefList<E extends DOMElement> = ElementRef<E>[];

export interface Page {
  goto(url: string): Promise<void>;
  goBack(): Promise<void>;
  goForward(): Promise<void>;
  waitForNavigation(url: string): Promise<void>;
  reload(): Promise<void>;
  close(): Promise<void>;

  click(selector: string): Promise<void>;
  dblclick(selector: string): Promise<void>;
  hover(selector: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  type(selector: string, value: string): Promise<void>;
  focus(selector: string): Promise<void>;
  keyPress(key: KeyboardKey): Promise<void>;
  check(selector: string): Promise<void>;
  uncheck(selector: string): Promise<void>;
  selectOption(selector: string, label: string): Promise<void>;
  selectText(selector: string): Promise<void>;

  // todo: define file type, implement
  attachFile(from: string, file: any): Promise<void>;
  drag(selector: string, x: number, y: number): Promise<void>

  pause(): Promise<void>;

  query<T extends DOMElement>(selector: string): Promise<ElementRef<T>>;
  queryList<T extends DOMElement>(selector: string): Promise<ElementRefList<T>>;

  dbgQuery<T extends DOMElement>(selector: string): Promise<ElementRef<T> | null>;
  dbgQueryList<T extends DOMElement>(selector: string): Promise<ElementRefList<T>>;
}