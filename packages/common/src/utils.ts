export function yes(): boolean {
  return true;
}

export function isUndefined<T>(test: T): boolean {
  return test === undefined;
}

export function isString<T>(test: T): boolean {
  return Object.prototype.toString.call(test) === '[object String]';
}

export function isRegExp<T>(test: T): boolean {
  return Object.prototype.toString.call(test) == '[object RegExp]';
}

export function isFunction<T>(test: T): boolean {
  return typeof test === 'function';
}

export function escapeRE(text: string): string {
  if (!text) {
    return text;
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when 
  // the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return text
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reinterpret<NT, V = any>(value: V): NT {
  return value as unknown as NT;
}

export function likeKeyValue(test: unknown): boolean {
  return Array.isArray(test) && test.length == 2;
}

export function ellipsis(text: string, maxLength: number): string {
  const dots = '...';
  const limit = maxLength - dots.length;

  if (!text || text.length < limit) {
    return text;
  }

  return text.substring(0, limit) + '...';
}

export function padRight(text: string, width: number, symbol = ' '): string {
  return text + Array(Math.max(0, width - text.length)).fill(symbol).join('');
}

export function ticksToTime(ms: number): string {
  const pad2 = (value: number) => {
    const text = '0' + value;
    return text.substring(text.length - 2);
  };

  const seconds = ms / 1000;
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds / 60) % 60);
  const second = seconds % 60;

  return pad2(hour) + ':' + pad2(minute) + ':' + pad2(second);
}