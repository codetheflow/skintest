const map = new Map<string, string>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function my(keys: TemplateStringsArray, ...args: any[]): string {
  const key = id(keys.raw, args);

  if (map.has(key)) {
    return map.get(key) || '';
  }

  const stamp = ticks();
  const value = `${my.prefix}${stamp} ${key}`;
  map.set(key, value);
  return value;
}

my.prefix = 'e2e-';
my.stamp = Symbol('@skintest/enterprise/my/stamp');

my.clear = clear;
my.raw = raw;

function clear(): void {
  map.clear();
}

function ticks(): string {
  return (Date.now() + '').split('').reverse().join('');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function raw(keys: TemplateStringsArray, ...args: any[]): string {
  const key = id(keys.raw, args);
  if (map.has(key)) {
    return map.get(key) || '';
  }

  const value = keys
    .map((chunk, i) => {
      if (args.length <= i) {
        return chunk;
      }

      let arg = args[i];
      if (arg === my.stamp) {
        arg = ticks();
      }

      return arg ? chunk + arg : chunk;
    })
    .join('');

  map.set(key, value);
  return value;
}

function id(keys: readonly string[], args: unknown[]): string {
  return keys
    .map((chunk, i) => {
      if (args.length <= i) {
        return chunk;
      }

      const arg = args[i];
      if (arg === my.stamp) {
        return chunk;
      }

      return arg ? chunk + arg : chunk;
    })
    .join('');
}