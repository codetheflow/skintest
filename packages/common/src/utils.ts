export function yes(): boolean {
  return true;
}

export function isUndefined<T>(value: T): boolean {
  return value === undefined;
}

export function isString<T>(value: T): boolean {
  return Object.prototype.toString.call(value) === '[object String]';
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

export function reinterpret<NT, V = any>(value: V): NT {
  return value as unknown as NT;
}