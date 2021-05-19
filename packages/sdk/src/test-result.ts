import { formatSelector } from './format';
import { ElementRef } from './page';

// todo: better fails status codes, make enum, solution as hyperlink?
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

export type TestExecutionResult = TestFail | TestPass;

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

// do it better
export function fail(): TestFail {
  return {
    status: 'fail',
    code: '',
    description: '',
    solution: ''
  };
}

export function unknownFail(ex: Error): TestFail {
  return {
    status: 'fail',
    code: '',
    description: ex.message,
    solution: ''
  };
}

export function unaryAssertFail(message: string): TestFail {
  return {
    status: 'fail',
    code: '',
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
    code: '',
    description: `expected \`${etalon}\`, got \`${actual}\``,
    solution: 'check assert condition'
  };
}

export function notFoundElement(query: string): TestFail {
  return {
    status: 'fail',
    code: '',
    description: `element ${formatSelector(query)} is not found`,
    solution: 'check selector and element availability'
  };
}

export function timeout(ex: Error): TestFail {
  return {
    status: 'fail',
    code: '',
    description: 'timeout exceed',
    solution: 'check selector and element availability or increase a timeout'
  };
}

export function dontSeeFail(): TestFail {
  // todo: get rid
  return {
    status: 'fail',
    code: '',
    description: 'don\'t see',
    solution: ''
  };
}

export async function asTest(promise: Promise<void>): Promise<TestExecutionResult> {
  await promise;

  // if there were no exception return `ok`
  return pass();
}