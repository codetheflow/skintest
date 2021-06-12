export interface StringDictionary<T> {
  [key: string]: T;
}

export interface NumberDictionary<T> {
  [key: number]: T;
}

export type KeyValue<T> = [key: string, value: T];
export type Maybe<T> = T | undefined;
export type Predicate<T> = (value: T) => boolean;

export type Serializable = Record<string, unknown>;
export interface Boxed<V extends Serializable> {
  value: V
}