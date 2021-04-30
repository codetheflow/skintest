import { KeyboardKey } from './keyboard';
import { DOMElement } from './dom';

export interface ElementRef<T extends DOMElement> {
  innerText(): Promise<string>;
}

export interface Engine {
  goto(url: string): Promise<void>;
  waitForNavigation(url: string): Promise<void>;

  click(query: string): Promise<void>;
  fill(query: string, value: string): Promise<void>;
  focus(query: string): Promise<void>;
  drag(query: string, x: number, y: number): Promise<void>

  press(key: KeyboardKey): Promise<void>;

  // TODO: define file type
  attachFile(from: string, file: any): Promise<void>;

  pause(): Promise<void>;

  select<T extends DOMElement>(query: string): Promise<ElementRef<T> | null>;
  selectAll<T extends DOMElement>(query: string): Promise<ElementRef<T>[]>;
}
