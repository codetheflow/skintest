import { errors, qte } from '@skintest/common';
import * as pw from 'playwright';

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
    if (ex instanceof pw.errors.TimeoutError) {
      const re = /Timeout ([0-9]+)ms exceeded/;
      const xs = re.exec(ex.message);
      const value = xs ? Number.parseInt(xs[1]) : 'unknown';
      throw errors.timeout(source, value, ex);
    }

    // remove logs from the playwright errors
    let { message } = (ex as Error);
    message = message.split('\n')[0];

    throw errors.runtime(message, ex);
  }
}