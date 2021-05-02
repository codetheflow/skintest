import { ElementRef } from './engine';
import { formatSelector } from './format';

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
  selector: string;
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

export function checkFail(): TestFail {
  return {
    status: 'fail',
    code: 'CHECK_FAIL',
    description: '',
    solution: ''
  };
}

export function unaryAssertFail(message: string): TestFail {
  return {
    status: 'fail',
    code: 'UNARY_ASSERT_FAIL',
    description: message,
    solution: 'check assert condition'
  };
}

export function binaryAssertFail<V>(
  etalon: V,
  actual: V
): TestFail {
  return {
    status: 'fail',
    code: 'BINARY_ASSERT_FAIL',
    description: `expected \`${etalon}\`, got \`${actual}\``,
    solution: 'check assert condition'
  };
}

export function notFoundElement(query: string): TestFail {
  return {
    status: 'fail',
    code: 'NOT_FOUND_ELEMENT',
    description: `element ${formatSelector(query)} is not found`,
    solution: 'check selector and element availability'
  };
}

export function timeout(ex: Error): TestFail {
  return {
    status: 'fail',
    code: 'TIMEOUT',
    description: 'timeout exceed',
    solution: 'check selector and element availability or increase a timeout'
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