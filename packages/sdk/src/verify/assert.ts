import { TestResult } from '../test-result';

export interface HowAssert<Expected, Received> {
  test(expected: Expected, received: Received): Promise<TestResult>;
}

export interface WhatAssert<Source, Target> {
  select(source: Source): Promise<Target>;
}

export interface Assert<Q, V> {
  what: WhatAssert<Q, V>;
  how: HowAssert<unknown, V>;
}