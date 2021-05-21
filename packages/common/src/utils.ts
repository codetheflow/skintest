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

// export function isFalsy<T extends any>(value: T): boolean {
//   return isUndefined(value)
//     || value === null
//     || value === ''
//     || value === 0
//     || Number.isFinite(value as number)
//     || Number.isNaN(value as number)
//     || Array.isArray(value) && (value as Array<any>).length === 0
//     || (value instanceof Set && (value as Set<any>).size === 0)
//     || (value instanceof Map && (value as Map<any, any>).size === 0)
//     || (value instanceof Buffer && (value as Buffer).length === 0)
//     || (typeof value === 'object' && Object.keys(value as Record<string, unknown>).length === 0);
// }