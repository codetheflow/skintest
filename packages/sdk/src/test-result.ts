import { StringDictionary } from '@skintest/common';
import { AssertHow, AssertWhat } from './assert';
import { DOMElement } from './dom';
import { ElementRef } from './element';
import { formatSelector } from './format';
import { Query, QueryList } from './query';

// todo: make enum, solution as hyperlink?
export interface TestFail {
  status: 'fail',
  description: string;
  solution: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: StringDictionary<any>;
}

export interface TestPass {
  status: 'pass';
  inspect: InspectInfo | null;
}

export interface InspectInfo {
  selector: string;
  target: ElementRef<DOMElement> | ElementRef<DOMElement>[] | null;
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

  binaryAssert(body: {
    query: Query | QueryList,
    what: AssertWhat,
    how: AssertHow,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    etalon: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actual: any,
  }): TestFail {
    const selector = formatSelector(body.query.toString());
    const method = body.query.type === 'query' ? '$' : '$$';

    const description =
      `${method}(${selector}).${body.what}:` +
      `expected \`${body.actual}\` to ${body.how} \`${body.etalon}\``;

    return {
      status: 'fail',
      description,
      solution: 'check assert condition',
      body
    };
  },

  elementNotFound(body: {
    query: Query | QueryList,
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