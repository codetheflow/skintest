export interface Select<T> {
  query: string;
  see: keyof T | null;
}

export interface SelectAll<T> {
  query: string;
  see: keyof T | null;
  length: number;
  get(index: number): Select<T>;
}

export function $<T>(query: string, see?: keyof T): Select<T> {
  return {
    query,
    see: see || null
  };
}

export function $$<T>(query: string, see?: keyof T): SelectAll<T> {
  return {
    query,
    see: see || null,
    length: 0,
    get: (index: number) => null as any,
  };
}

