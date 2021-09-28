import { isFunction } from '@skintest/common';
import { Query, QueryList } from '@skintest/sdk';
import { DOMElement } from './dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function $<E extends DOMElement>(query: TemplateStringsArray, ...args: any[]): Query<E> {
  return {
    type: 'query',
    toString() {
      return String.raw(query, ...args.map(stringify));
    }
  };
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function $$<E extends DOMElement>(query: TemplateStringsArray, ...args: any[]): QueryList<E> {
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