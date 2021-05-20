import {
  AssertWhat,
  NumberAssert,
  NumberAssertCore,
  StringAssert,
  StringAssertCore,
  UnaryAssert,
  UnaryAssertCore,
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
    return new StringAssertCore(AssertWhat.innerText);
  }

  get value(): StringAssert {
    return new StringAssertCore(AssertWhat.value);
  }

  get length(): NumberAssert {
    return new NumberAssertCore(AssertWhat.length);
  }

  get focus(): UnaryAssert {
    return new UnaryAssertCore(AssertWhat.focus);
  }
}

export const has: Has<any> & HasAll<any> = new Assertion();