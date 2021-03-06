import { isFunction } from '@skintest/common';
import { DOMElement } from './dom';

export abstract class Query<E = DOMElement> {
  // we need to keep something with type V, to turn on type checking
  // todo: investigate better solution
  private token?: E;

  type: 'query' = 'query';
  abstract toString(): string;
}

export abstract class QueryList<E = DOMElement> {
  private token?: E;

  type: 'queryList' = 'queryList';
  abstract toString(): string;
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
  let text: string;
  if (arg && arg.toString && isFunction(arg.toString)) {
    text = arg.toString();
  } else {
    text = '' + arg;
  }

  // escape " with \"
  // https://playwright.dev/docs/selectors#text-selector
  return text.replace('"', '\\"');
}