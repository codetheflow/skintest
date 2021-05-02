import { KeyboardKey } from './keyboard';
import { DOMElement } from './dom';

export interface ElementRef<T extends DOMElement> {
  innerText(): Promise<string>;
  value(): Promise<string>;
  hasFocus(): Promise<boolean>;
}

export type ElementRefList<T extends DOMElement> = ElementRef<T>[];

export interface Engine {
  goto(url: string): Promise<void>;
  waitForNavigation(url: string): Promise<void>;

  click(selector: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  focus(selector: string): Promise<void>;
  drag(selector: string, x: number, y: number): Promise<void>

  press(key: KeyboardKey): Promise<void>;

  // TODO: define file type
  attachFile(from: string, file: any): Promise<void>;

  pause(): Promise<void>;

  select<T extends DOMElement>(selector: string): Promise<ElementRef<T> | null>;
  selectAll<T extends DOMElement>(selector: string): Promise<ElementRefList<T>>;
}
