import { isUndefined } from './utils';

/**
 * Recursively merges own and inherited enumerable string keyed properties
 * of source objects into the destination object. 
 * Source properties that resolve to undefined are skipped. 
 * Plain object properties are merged recursively. 
 * Other objects and value types are overridden by assignment.
 * Source objects are applied from left to right. 
 * 
 * @param first the first source plain object
 * @param other list of the source plain objects
 * @returns extended destination object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extend<T>(first: T, ...other: Partial<T>[]): T {
  const result: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function merge(obj: any) {
    for (const key in obj) {
      const value = obj[key];
      if (isUndefined(value)) {
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (Object.prototype.toString.call(value) === '[object Object]') {
          result[key] = extend(value);
        } else {
          result[key] = value;
        }
      }
    }
  }

  for (const obj of [first, ...other]) {
    merge(obj);
  }

  return result as T;
}