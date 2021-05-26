import { isFunction } from '@skintest/common';
import { DOMElement } from './dom';

export interface Query<E = DOMElement> {
  // we need to keep something with type V, to turn on type checking
  // todo: investigate better solution
  token?: E;

  type: 'query';
  toString(): string;
}

export interface QueryList<E = DOMElement> {
  token?: E;

  type: 'queryList'
  toString(): string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function $<E>(query: TemplateStringsArray, ...args: any[]): Query<E> {
  return {
    type: 'query',
    toString() {
      return String.raw(query, ...args.map(stringify));
    }
  };
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function $$<E>(query: TemplateStringsArray, ...args: any[]): QueryList<E> {
  return {
    type: 'queryList',
    toString() {
      return String.raw(query, ...args.map(stringify));
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stringify(arg: any): any {
  if (arg && arg.toString && isFunction(arg.toString)) {
    return arg.toString();
  }

  return arg;
}