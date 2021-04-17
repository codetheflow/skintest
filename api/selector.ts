export interface Selector<T> {
 xxx: any; // TODO: define interface
}

export interface SelectorAll<T> {
  length: number;
  get(index: number): Selector<T>;
}

export function select<T>(query: string): Selector<T> {
  throw new Error('not implemented');
}

export function selectAll<T>(query: string): SelectorAll<T> {
  throw new Error('not implemented');
}