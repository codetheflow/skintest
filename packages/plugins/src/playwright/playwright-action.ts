import { errors, qte } from '@skintest/common';
import * as playwright from 'playwright';

export function PlaywrightAction() {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      // todo: use meta?
      const source = `${propertyKey}(${args.map(x => qte('' + x)).join(', ')})`;
      return playwrightAction(source, () => method.apply(this, args));
    };
  };
}

export async function playwrightAction<T>(source: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  }
  catch (ex) {
    if (ex instanceof playwright.errors.TimeoutError) {
      throw errors.timeout(source, ex);
    }

    // remove logs from the playwright errors
    let { message } = (ex as Error);
    message = message.split('\n')[0];

    throw errors.runtime(message, ex);
  }
}