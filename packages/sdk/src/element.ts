import { DOMElement } from './dom';
import { ClientElement } from './recipe';

export type ElementState =
  'checked'
  | 'disabled'
  | 'focused'
  | 'editable'
  | 'enabled'
  | 'hidden'
  | 'unchecked'
  | 'visible';

export interface ElementClassList {
  has(name: string): boolean;
  toString(): string;
}

export interface ElementRef<E extends DOMElement> extends ClientElement<E> {
  innerText(): Promise<string>;
  value(): Promise<string>;
  state(state: ElementState): Promise<boolean>;
  classList(): Promise<ElementClassList>;
  attribute(name: string): Promise<string | null>;
  style(name: string): Promise<string | null>;
}

export type ElementRefList<E extends DOMElement> = ElementRef<E>[];