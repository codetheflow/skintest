import { StringDictionary } from '@skintest/common';
import { AssertHow, AssertWhat } from './assert';
import { ElementRef } from './element';
import { formatSelector } from './format';
import { Query, QueryList } from './query';

// todo: make enum, solution as hyperlink?
export interface TestFail {
  status: 'fail',
  description: string;
  solution: string;
  body: StringDictionary<any>;
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

export async function asTest(promise: Promise<void>): Promise<TestExecutionResult> {
  await promise;

  // if there were no exception return `ok`
  return pass();
}

export const fails = {

  binaryAssert<V>(body: {
    query: Query<any> | QueryList<any>,
    what: AssertWhat,
    how: AssertHow,
    etalon: V,
    actual: V,
  }): TestFail {
    const selector = formatSelector(body.query.toString());
    const method = body.query.type === 'query' ? '$' : '$$';

    return {
      status: 'fail',
      description: `${method}(${selector}).${body.what}: expected \`${body.actual}\` to ${body.how} \`${body.etalon}\``,
      solution: 'check assert condition',
      body
    };
  },

  elementNotFound<V>(body: {
    query: Query<any> | QueryList<any>,
  }): TestFail {
    const selector = formatSelector(body.query.toString());
    const method = body.query.type === 'query' ? '$' : '$$';

    return {
      status: 'fail',
      description: `${method}(${selector}) is not reachable`,
      solution: 'check selector correctness and availability',
      body,
    };
  },

}