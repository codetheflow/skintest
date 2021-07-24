import { reinterpret } from '@skintest/common';
import { Value, VALUE_REF } from './value';

export type InvalidData<Type, Data, Key> = ['invalid data', Type, Data, Key];

export function from<Type, Data, Key extends keyof Data>(key: Key): Data[Key] extends Type ? Value<Type, Data> : InvalidData<Type, Data, Key> {
  const result: Value<Type, Data> = {
    [VALUE_REF]: key,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return reinterpret<any>(result);
}