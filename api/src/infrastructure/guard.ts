import { error } from './error';
import { isUndefined } from './utils';

export class Guard {
  static notUndefined<T>(value: T, message: string) {
    if (isUndefined(value)) {
      throw error('guard', message);
    }
  }

  static notNull<T>(value: T, message: string) {
    if (value === null || isUndefined(value)) {
      throw error('guard', message);
    }
  }

  static notNullOrEmpty(value: string, message: string) {
    if (value === null || isUndefined(value) || value === '') {
      throw error('guard', message);
    }
  }
}