export const VALUE_KEY = Symbol('@skintest/sdk/value-key');

export type Value<Type, Data> = Type | {
  [VALUE_KEY]: keyof Data,
};

export function stringify<T, D>(value: Value<T, D>): string {
  if ('key' in value) {
    const key = value[VALUE_KEY];
    return `value from \`${key}\``;
  }

  return '' + value;
}