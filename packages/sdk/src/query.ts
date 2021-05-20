import { DOMElement } from './dom';

export interface Query<E extends DOMElement> {
  type: 'query';
  toString(): string;
}

export interface QueryList<E extends DOMElement> {
  type: 'queryList'
  toString(): string;
}

export function $<E extends DOMElement>(query: string): Query<E> {
  return {
    type: 'query',
    toString() {
      return query;
    }
  };
}

export function $$<E extends DOMElement>(query: string): QueryList<E> {
  return {
    type: 'queryList',
    toString() {
      return query;
    }
  };
}