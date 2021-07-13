import { isUndefined } from './utils';

/**
 * Recursively merges own and inherited enumerable string keyed properties
 * of source objects into the destination object. 
 * Source properties that resolve to undefined are skipped. 
 * Plain object properties are merged recursively. 
 * Other objects and value types are overridden by assignment. 
 * Source objects are applied from left to right. 
 * 
 * @param records list of the source plain objects
 * @returns extended destination object
 */
export function extend<T extends Record<string, unknown>>(...records: T[]): T {
  const result: Record<string, unknown> = {};

  function merge(obj: T) {
    for (const key in obj) {
      const value = obj[key];
      if (isUndefined(value)) {
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (Object.prototype.toString.call(value) === '[object Object]') {
          result[key] = extend(value as Record<string, unknown>);
        } else {
          result[key] = value;
        }
      }
    }
  }

  for (const obj of records) {
    merge(obj);
  }

  return result as T;
}