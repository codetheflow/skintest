import { Exception, notEmptyError, notNullError, undefinedError } from './errors';
import { isUndefined } from './utils';

export class Guard {
  static notUndefined<T>(value: T, name: string): Exception | void {
    if (isUndefined(value)) {
      throw undefinedError(name);
    }
  }

  static notNull<T>(value: T, name: string): Exception | void  {
    if (value === null || isUndefined(value)) {
      throw notNullError(name);
    }
  }

  static notEmpty(value: string, name: string): Exception | void  {
    if (value === null || isUndefined(value) || value === '') {
      throw notEmptyError(name);
    }
  }
}