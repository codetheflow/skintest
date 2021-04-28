function error(name: string, message: string) {
  return new Error(`${name}: ${message}`);
}


export function invalidArgumentError<T>(name: string, value: T) {
  return error('invalid argument', `${name} ${value}`);
}

export function unknownEngineError(ex: Error) {
  // todo: wrap with skintest error
  return ex;
}

export function undefinedError(name: string) {
  return error('undefined', name);
}

export function notNullError(name: string) {
  return error('not null', name);
}

export function notEmptyError(name: string) {
  return error('not empty', name);
}