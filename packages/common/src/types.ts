export interface StringDictionary<T> {
  [key: string]: T;
}

export interface NumberDictionary<T> {
  [key: number]: T;
}

export type KeyValue<T> = [key: string, value: T];