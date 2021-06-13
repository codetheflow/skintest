const map = new Map<string, string>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stamp(keys: TemplateStringsArray, ...args: any[]): string {
  const key = String.raw(keys, ...args);
  if (map.has(key)) {
    return map.get(key) || '';
  }

  const value = keys
    .map((chunk, i) => {
      if (args.length <= i) {
        return chunk;
      }

      let arg = args[i];
      if (arg === stamp.time) {
        arg = Date.now();
      }

      return arg ? arg + chunk : chunk;
    })
    .join('');

  map.set(key, value);
  return value;
}

stamp.time = Symbol('skintest.stamp.time');