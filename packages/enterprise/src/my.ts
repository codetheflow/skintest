const map = new Map<string, string>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function my(keys: TemplateStringsArray, ...args: any[]): string {
  return `${my.prefix}-${Date.now()} ${my.raw(keys, ...args)}`;
}

my.prefix = '#e2e';
my.time = Symbol('@skintest/enterprise/my-time');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
my.raw = (keys: TemplateStringsArray, ...args: any[]): string => {
  const key = String.raw(keys, ...args.filter(x => x !== my.time));
  if (map.has(key)) {
    return map.get(key) || '';
  }

  const value = keys
    .map((chunk, i) => {
      if (args.length <= i) {
        return chunk;
      }

      let arg = args[i];
      if (arg === my.time) {
        arg = Date.now();
      }

      return arg ? chunk + arg : chunk;
    })
    .join('');

  map.set(key, value);
  return value;
};