import { errors, Exception } from './errors';
import { isUndefined } from './utils';

export class Guard {
  static notUndefined<T>(value: T, name: string): Exception | void {
    if (isUndefined(value)) {
      throw errors.undefined(name);
    }
  }

  static notNull<T>(value: T, name: string): Exception | void {
    if (value === null || isUndefined(value)) {
      throw errors.notNull(name);
    }
  }

  static notEmpty(value: string, name: string): Exception | void {
    if (value === null || isUndefined(value) || value === '') {
      throw errors.notEmpty(name);
    }
  }
}