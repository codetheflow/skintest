import { TestFail } from './test-result';

export function notEqualsFail<T>(etalon: T, actual: T): TestFail {
  return {
    code: 'NOT_EQUALS',
    description: `${etalon} !== ${actual}`,
    solution: 'make sure that values are correct'
  };
}

export function notFoundElementFail(name: string): TestFail {
  return {
    code: 'NOT_FOUND_ELEMENT',
    description: `element ${name} is not found`,
    solution: 'try to change selector and make sure that element is available '
  };
}

export function timeoutFail(ex: Error): TestFail {
  return {
    code: 'TIMEOUT',
    description: ex.message,
    solution: 'try to change selector and make sure that element is available or increase timeout'
  };
}

export function dontSeeFail(): TestFail {
  // TODO: get rid
  return {
    code: 'DONT_SEE',
    description: 'dont see',
    solution: ''
  };
}