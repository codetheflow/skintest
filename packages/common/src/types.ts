export interface StringDictionary<T> {
  [key: string]: T;
}

export interface NumberDictionary<T> {
  [key: number]: T;
}

export type KeyValue<T> = [key: string, value: T];
export type Optional<T> = T | undefined;
export type Predicate<T> = (value: T) => boolean;

export type Data = Record<string, unknown>;
export interface Boxed<V> {
  value: V
}