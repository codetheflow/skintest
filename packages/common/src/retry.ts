import { performance } from 'perf_hooks';
import { errors } from './errors';
import { Predicate } from './types';

export type RetryAction<T> = (action: () => Promise<T>) => Promise<T>;

export type RetryOptions<T> = {
  until: Predicate<T>,
  untilError: Predicate<Error>,
  delay: number,
  timeout: number,
};

type Resolve<T> = (value: T) => void;
type Reject = (reason: Error) => void;

export function retry<T>(options: RetryOptions<T>): RetryAction<T> {
  return action => {
    const startTime = performance.now();

    function checkTimeout(reject: Reject): boolean {
      const stopTime = performance.now();
      if (stopTime - startTime > options.timeout) {
        reject(errors.timeout('attempt'));
        return false;
      }

      return true;
    }

    function nextTry(resolve: Resolve<T>, reject: Reject) {
      setTimeout(() => {
        attempt(resolve, reject);
      }, options.delay);
    }

    function attempt(resolve: Resolve<T>, reject: Reject) {
      action()
        .then(value => {
          if (options.until(value)) {
            resolve(value);
            return;
          }

          if (checkTimeout(reject)) {
            nextTry(resolve, reject);
          }
        })
        .catch(ex => {
          if (ex instanceof Error) {
            if (options.untilError(ex as Error)) {
              // that means that timeout is already working
              reject(ex);
              return;
            }
          }

          if (checkTimeout(reject)) {
            nextTry(resolve, reject);
          }
        });
    }

    return new Promise<T>(attempt);
  };
}