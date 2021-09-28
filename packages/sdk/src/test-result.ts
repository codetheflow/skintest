import { StringDictionary } from '@skintest/common';

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
  description: string;
}

export type TestResult = TestFail | TestPass;

export function pass(description = ''): TestPass {
  return {
    status: 'pass',
    description
  };
}

export const fail = {
  // statement(
  //   body: {
  //     assert: AssertHost,
  //     query: Query | QueryList,
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     expected: any,
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     received: any,
  //   }): TestFail {
  //   const selector = body.query.toString();
  //   const method = body.query.type === 'query' ? '$' : '$$';

  //   const description =
  //     `${method}(${selector}).${body.assert.what}: ` +
  //     `expected ${qte(body.received)} to ` +
  //     `${body.assert.no ? 'not' : ''} ` +
  //     `${body.assert.how} ${qte(body.expected)}`;

  //   return {
  //     body,
  //     description,
  //     solution: 'check assert condition',
  //     status: 'fail',
  //   };
  // },
  // element(
  //   body: {
  //     query: Query | QueryList,
  //   }
  // ): TestFail {
  //   const selector = body.query.toString();
  //   const method = body.query.type === 'query' ? '$' : '$$';

  //   return {
  //     body,
  //     description: `${method}(${selector}) is not reachable`,
  //     solution: 'check selector correctness and availability',
  //     status: 'fail',
  //   };
  // },
  reason(
    body: {
      description: string,
      solution: string,
    }
  ): TestFail {
    return {
      body,
      description: body.description,
      solution: body.solution,
      status: 'fail',
    };
  }
};