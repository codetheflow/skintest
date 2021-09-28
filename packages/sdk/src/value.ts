import { isObject, qte, reinterpret } from '@skintest/common';

export const VALUE_REF = Symbol('@skintest/sdk/value-ref');

export type ValueRef<Data> = {
  [VALUE_REF]: keyof Data,
};

export type Value<Type, Data> = Type | ValueRef<Data>;

export function stringifyValue<T, D>(value: Value<T, D>): string {
  if (isObject(value) && VALUE_REF in value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = reinterpret<any>(value)[VALUE_REF];
    return `value from ${qte(key)}`;
  }

  return '' + value;
}