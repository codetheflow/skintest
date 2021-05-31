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
  loop: 'break' | 'continue',
  solution: string;
  status: 'fail',
}

export interface TestPass {
  status: 'pass';
  inspect: InspectInfo | null;
}

export interface InspectInfo {
  selector: string;
  target: ElementRef<DOMElement> | ElementRef<DOMElement>[] | null;
}

export type TestResult = TestFail | TestPass;

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

export const fails = {
  binaryAssert(body: {
    assert: AssertHost,
    query: Query | QueryList,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    etalon: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actual: any,
  }): TestFail {
    const selector = formatSelector(body.query.toString());
    const method = body.query.type === 'query' ? '$' : '$$';

    const description =
      `${method}(${selector}).${body.assert.what}:` +
      `expected \`${body.actual}\` to ` +
      `${body.assert.no ? 'not' : ''} ` +
      `${body.assert.how} \`${body.etalon}\``;

    return {
      status: 'fail',
      description,
      solution: 'check assert condition',
      loop: 'continue',
      body,
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
      loop: 'continue',
      body,
    };
  },
  that(body: {
    description: string,
    solution: string,
  }): TestFail {
    return {
      status: 'fail',
      description: body.description,
      solution: body.solution,
      loop: 'continue',
      body,
    };
  }
};