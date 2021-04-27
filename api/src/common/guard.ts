import { isUndefined } from './check';
import { notNullError, undefinedError, notEmptyError } from './errors';

export class Guard {
  static notUndefined<T>(value: T, name: string) {
    if (isUndefined(value)) {
      throw undefinedError(name);
    }
  }

  static notNull<T>(value: T, name: string) {
    if (value === null || isUndefined(value)) {
      throw notNullError(name);
    }
  }

  static notEmpty(value: string, name: string) {
    if (value === null || isUndefined(value) || value === '') {
      throw notEmptyError(name);
    }
  }
}