function error(name: string, message: string) {
  return new Error(`${name}: ${message}`);
}

export function invalidArgumentError<T>(name: string, value: T) {
  return error('invalidArgument', `\`${name}\` with value \`${value}\``);
}

export function unknownPageError(ex: Error) {
  // todo: wrap with skintest error
  return ex;
}

export function undefinedError(name: string) {
  return error('undefined', name);
}

export function notNullError(name: string) {
  return error('notNull', name);
}

export function notEmptyError(name: string) {
  return error('notEmpty', name);
}

export function pageNotFoundError(id: string) {
  return error('pageNotFound', `page \`${id}\` is not found`);
}

export function noCurrentPage() {
  return error('noCurrentPage', `no page opened, please make sure that \`I.open()\` was called before`);
}

export function elementNotFoundError(selector: string) {
  return error('elementNotFound', `element \`${selector}\` is not found`);
}