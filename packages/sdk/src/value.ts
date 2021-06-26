import { isObject, reinterpret } from '@skintest/common';

export const VALUE_KEY = Symbol('@skintest/sdk/value-key');

export type Value<Type, Data> = Type | {
  [VALUE_KEY]: keyof Data,
};

export function stringify<T, D>(value: Value<T, D>): string {
  if (isObject(value) && VALUE_KEY in value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = reinterpret<any>(value) [VALUE_KEY];
    return `value from \`${key}\``;
  }

  return '' + value;
}