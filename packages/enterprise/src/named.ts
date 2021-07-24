import { uuid } from './uuid';

export const named = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
  f: 'f',
  g: 'g',
  h: 'h',

  get randomly(): string {
    return uuid();
  }

};