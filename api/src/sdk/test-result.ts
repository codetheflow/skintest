import { ElementRef } from './engine';

export interface TestFail {
  status: 'fail',
  code: string;
  description: string;
  solution: string;
}

export interface TestPass {
  status: 'pass';
  inspect: InspectInfo | null;
}

export interface InspectInfo {
  query: string;
  target: ElementRef<any> | ElementRef<any>[] | null;
}

export type TestExecutionResult = Promise<TestFail | TestPass>;

export function pass(): TestPass {
  return {
    status: 'pass',
    inspect: null
  };
}

export function inspect(info: InspectInfo): TestPass {
  return {
    status: 'pass',
    inspect: info
  };
}

export function notEqualsFail<T>(etalon: T, actual: T): TestFail {
  return {
    status: 'fail',
    code: 'NOT_EQUALS',
    description: `expected \`${etalon}\`, but was \`${actual}\``,
    solution: 'make sure that values are correct'
  };
}

export function notFoundElementFail(name: string): TestFail {
  return {
    status: 'fail',
    code: 'NOT_FOUND_ELEMENT',
    description: `element ${name} is not found`,
    solution: 'try to change selector and make sure that element is available '
  };
}

export function timeoutFail(ex: Error): TestFail {
  return {
    status: 'fail',
    code: 'TIMEOUT',
    description: ex.message,
    solution: 'try to change selector and make sure that element is available or increase timeout'
  };
}

export function dontSeeFail(): TestFail {
  // TODO: get rid
  return {
    status: 'fail',
    code: 'DONT_SEE',
    description: 'dont see',
    solution: ''
  };
}