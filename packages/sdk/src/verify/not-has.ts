import { fail, pass, TestResult } from '../test-result';
import { HowAssert } from './assert';

class LikeTextAssert implements HowAssert<string, string | RegExp> {
  async test(expected: string, received: string | RegExp): Promise<TestResult> {
    let result = true;
    if (typeof received === 'string') {
      result = received.includes(expected);
    } else {
      result = received.test(expected);
    }

    if (result) {
      return pass();
    }

    return fail.reason({
      description: `${expected} is not like ${received}`,
      solution: '',
    });
  }
}

class EqualsTextAssert implements HowAssert<string, string> {
  async test(expected: string, received: string): Promise<TestResult> {
    if (expected === received) {
      return pass();
    }

    return fail.reason({
      description: `${expected} is not like ${received}`,
      solution: '',
    });
  }
}

// export class NotHas<T> {
//   constructor(private assert: Assert<T,) {
//   }

//   get equals(): Assert<T, string> {
//     return {
//       what: this.what,
//       how: new EqualsTextAssert(),
//     };
//   }

//   get like(): Assert<T, string | RegExp> {
//     return {
//       what: this.what,
//       how: new LikeTextAssert(),
//     };
//   }
// }