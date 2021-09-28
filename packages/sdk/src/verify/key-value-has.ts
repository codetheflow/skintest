import { KeyValue } from '@skintest/common';
import { HowAssert, TestResult } from '../public-api';
import { fail, pass } from '../test-result';
import { Assert, WhatAssert } from './assert';

class KeyValueEqualsAssert implements HowAssert<KeyValue<string>, KeyValue<string>> {
  async test(expected: KeyValue<string>, received: KeyValue<string>): Promise<TestResult> {
    if (expected[0] === received[0] && expected[1] === received[1]) {
      return pass('');
    }

    return fail.reason({
      description: '',
      solution: ''
    });
  }
}

export class KeyValueHas<T> {
  constructor(private what: WhatAssert<T, KeyValue<string>>) {
  }

  get equals(): Assert<T, KeyValue<string>> {
    return {
      what: this.what,
      how: new KeyValueEqualsAssert(),
    };
  }
}