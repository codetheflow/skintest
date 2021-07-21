export const isFunction = <T>(test: T): boolean => typeof test === 'function';
export const noop = (): void => { return; };
export const yes = (): boolean => true;