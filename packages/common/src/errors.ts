export type Exception = Error;

function error(name: string, message: string): Exception {
  return new Error(`${name}: ${message}`);
}

export function invalidArgumentError<T>(name: string, value: T): Exception {
  return error('invalidArgument', `\`${name}\` with value \`${value}\``);
}

export function unknownError(ex: Error): Exception {
  // todo: wrap with skintest error
  return ex;
}

export function undefinedError(name: string): Exception {
  return error('undefined', name);
}

export function notNullError(name: string): Exception {
  return error('notNull', name);
}

export function notEmptyError(name: string): Exception {
  return error('notEmpty', name);
}

export function pageNotFoundError(id: string): Exception {
  return error('pageNotFound', `page \`${id}\` is not found`);
}

export function noCurrentPageError(): Exception {
  return error('noCurrentPage', `no page opened, please make sure that \`I.open()\` was called before`);
}

export function elementNotFoundError(selector: string): Exception {
  return error('elementNotFound', `element \`${selector}\` is not found`);
}

export function callerNotFoundError(frame: string): Exception {
  return error('callerNotFoundError', `caller is not found in the ${frame}`);
}