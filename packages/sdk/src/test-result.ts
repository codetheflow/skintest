import { StringDictionary } from '@skintest/common';
import { AssertHost } from './assert';
import { DOMElement } from './dom';
import { ElementRef } from './element';
import { formatSelector } from './format';
import { Query, QueryList } from './query';

// todo: make enum, solution as hyperlink?
export interface TestFail {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: StringDictionary<any>;
  description: string;
  solution: string;
  status: 'fail';
}

export interface TestPass {
  status: 'pass';
}

export interface InspectInfo {
  selector: string;
  target: ElementRef<DOMElement> | ElementRef<DOMElement>[] | null;
}

export type TestResult = TestFail | TestPass;

export function pass(): TestPass {
  return {
    status: 'pass'
  };
}

export const fail = {
  condition(body: {
    host: AssertHost,
    query: Query | QueryList,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    etalon: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actual: any,
  }): TestFail {
    const selector = formatSelector(body.query.toString());
    const method = body.query.type === 'query' ? '$' : '$$';

    const description =
      `${method}(${selector}).${body.host.what}: ` +
      `expected \`${body.actual}\` to ` +
      `${body.host.no ? 'not' : ''} ` +
      `${body.host.how} \`${body.etalon}\``;

    return {
      status: 'fail',
      description,
      solution: 'check assert condition',
      body,
    };
  },
  element(body: {
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
  reason(body: {
    description: string,
    solution: string,
  }): TestFail {
    return {
      status: 'fail',
      description: body.description,
      solution: body.solution,
      body,
    };
  }
};