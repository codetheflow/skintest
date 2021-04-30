import { DOMElement } from './dom';

export interface Select<E extends DOMElement> {
  type: 'select';
  toString(): string;
}

export interface SelectAll<E extends DOMElement> {
  type: 'selectAll'
  toString(): string;
}

export function $<E extends DOMElement>(query: string): Select<E> {
  return {
    type: 'select',
    toString() {
      return query;
    }
  };
}

export function $$<E extends DOMElement>(query: string): SelectAll<E> {
  return {
    type: 'selectAll',
    toString() {
      return query;
    }
  };
}
