import { ClientElement } from './client';
import { DOMElement } from './dom';

export type ElementState =
  'checked'
  | 'disabled'
  | 'editable'
  | 'enabled'
  | 'exists'
  | 'focused'
  | 'hidden'
  | 'unchecked'
  | 'visible';

export interface ElementClassList {
  has(name: string): boolean;
  toString(): string;
}

export interface ElementRef<E extends DOMElement> extends ClientElement<E> {
  attribute(name: string): Promise<string | null>;
  classList(): Promise<ElementClassList>;
  state(state: ElementState): Promise<boolean>;
  style(name: string): Promise<string | null>;
  tagName(): Promise<string>;
  text(): Promise<string>;
}

export type ElementRefList<E extends DOMElement> = ElementRef<E>[];