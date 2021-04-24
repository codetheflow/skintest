import { DOMElement } from '../platform/dom';

export interface Select<E extends DOMElement> {
  type: 'select';
  query: string;
}

export interface SelectAll<E extends DOMElement> {
  type: 'selectAll'
  query: string;
}

export function $<E extends DOMElement>(query: string): Select<E> {
  return {
    query,
    type: 'select'
  };
}

export function $$<E extends DOMElement>(query: string): SelectAll<E> {
  return {
    query,
    type: 'selectAll'
  };
}
