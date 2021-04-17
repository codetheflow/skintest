export interface Select<T> {
 xxx: any; // TODO: define interface
}

export interface SelectAll<T> {
  length: number;
  get(index: number): Select<T>;
}

export function $<T>(query: string): Select<T> {
  throw new Error('not implemented');
}

export function $$<T>(query: string): SelectAll<T> {
  throw new Error('not implemented');
}