export interface Select<T> {
  query: string;
  see: keyof T;
}

export interface SelectAll<T> {
  query: string;
  see: keyof T;
  length: number;
  get(index: number): Select<T>;
}

export function $<T>(query: string, see?: keyof T): Select<T> {
  return {
    query,
    see
  };
}

export function $$<T>(query: string, see?: keyof T): SelectAll<T> {
  throw new Error('not implemented');
}