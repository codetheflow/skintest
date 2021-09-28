import { fail, pass, TestResult } from '../test-result';
import { Assert, HowAssert, WhatAssert } from './assert';

class AboveNumberAssert implements HowAssert<number, number> {
  async test(expected: number, received: number): Promise<TestResult> {
    if (received > expected) {
      return pass();
    }

    return fail.reason({
      description: `expected ${received} > ${expected}`,
      solution: ''
    });
  }
}

class BelowNumberAssert implements HowAssert<number, number> {
  async test(expected: number, received: number): Promise<TestResult> {
    if (received < expected) {
      return pass();
    }

    return fail.reason({
      description: `expected ${received} < ${expected}`,
      solution: ''
    });
  }
}

class EqualsNumberAssert implements HowAssert<number, number> {
  async test(expected: number, received: number): Promise<TestResult> {
    if (received === expected) {
      return pass();
    }

    return fail.reason({
      description: `expected ${received} = ${expected}`,
      solution: ''
    });
  }
}

export class NumberHas<T> {
  constructor(private what: WhatAssert<T, number>) {
  }

  get equals(): Assert<T, number> {
    return {
      what: this.what,
      how: new EqualsNumberAssert(),
    };
  }

  get above(): Assert<T, number> {
    return {
      what: this.what,
      how: new AboveNumberAssert(),
    };
  }

  get below(): Assert<T, number> {
    return {
      what: this.what,
      how: new BelowNumberAssert(),
    };
  }
}