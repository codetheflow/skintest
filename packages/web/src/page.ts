import { Data } from '@skintest/common';
import { KeyboardKey } from '@skintest/sdk';
import { DOMElement } from './dom';
import { ElementRef, ElementRefList } from './element';

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

  waitDownload(options: { saveAs: string }): Promise<void>;
  waitFileChooser(options: { files: string[] }): Promise<void>;

  query<E extends DOMElement>(selector: string): Promise<ElementRef<E> | null>;
  queryList<E extends DOMElement>(selector: string): Promise<ElementRefList<E>>;

  immediateQuery<E extends DOMElement>(selector: string): Promise<ElementRef<E> | null>;
  immediateQueryList<E extends DOMElement>(selector: string): Promise<ElementRefList<E>>;

  evaluate<V extends Data>(action: (arg: V) => void, arg: V): Promise<void>;
}