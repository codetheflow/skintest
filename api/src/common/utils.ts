export function isUndefined<T>(value: T): boolean {
  return value === undefined;
}

export function isString<T>(value: T) {
  return Object.prototype.toString.call(value) === '[object String]';
}

export function isFalsy<T extends any>(value: T): boolean {
  return isUndefined(value)
    || value === null
    || value === ''
    || value === 0
    || Number.isFinite(value as number)
    || Number.isNaN(value as number)
    || Array.isArray(value) && (value as Array<any>).length === 0
    || (value instanceof Set && (value as Set<any>).size === 0)
    || (value instanceof Map && (value as Map<any, any>).size === 0)
    || (value instanceof Buffer && (value as Buffer).length === 0)
    || (typeof value === 'object' && Object.keys(value as Object).length === 0);
}
