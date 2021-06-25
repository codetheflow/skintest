import { reinterpret } from '@skintest/common';
import { Value, VALUE_KEY } from './value';

export function data<Type, Data, Key extends keyof Data>(key: Key): Data[Key] extends Type ? Value<Type, Data> : void {
  const result: Value<Type, Data> = {
    [VALUE_KEY]: key,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return reinterpret<any>(result);
}