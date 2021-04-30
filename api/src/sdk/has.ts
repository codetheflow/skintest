import {
  AssertWhat,
  NumberAssert,
  StringAssert
} from './assert';

export interface Has<V> {
  text: StringAssert;
}

export interface HasAll<V> {
  length: NumberAssert;
}

class Assertion<V> implements Has<V>, HasAll<V> {
  get text(): StringAssert {
    return new StringAssert(AssertWhat.innerText);
  }

  get length(): NumberAssert {
    return new NumberAssert(AssertWhat.length);
  }
}

export const has: Has<any> & HasAll<any> = new Assertion();
