import {
  AssertWhat,
  NumberAssert,
  StringAssert,
  UnaryAssert,
  BooleanAssert
} from './assert';

export interface Has<V> {
  text: StringAssert;
  value: StringAssert;
  focus: UnaryAssert;
}

export interface HasAll<V> {
  length: NumberAssert;
}

class Assertion<V> implements Has<V>, HasAll<V> {
  get text(): StringAssert {
    return new StringAssert(AssertWhat.innerText);
  }

  get value(): StringAssert {
    return new StringAssert(AssertWhat.value);
  }

  get length(): NumberAssert {
    return new NumberAssert(AssertWhat.length);
  }

  get focus(): UnaryAssert {
    return new BooleanAssert(AssertWhat.focus);
  }
}

export const has: Has<any> & HasAll<any> = new Assertion();
