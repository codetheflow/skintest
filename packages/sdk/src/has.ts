import {
  AssertWhat,
  BinaryAssert,
  KeyValueAssert,
  KeyValueAssertCore,
  NumberAssert,
  NumberAssertCore,
  StateAssertCore,
  StringAssert,
  StringAssertCore
} from './assert';
import { ElementState } from './element';

export interface Has<V> {
  class: StringAssert;
  state: BinaryAssert<ElementState>;
  attribute: KeyValueAssert;
  style: KeyValueAssert;
  text: StringAssert;
  value: StringAssert;
}

export interface HasAll<V> {
  length: NumberAssert;
}

class Assertion<V> implements Has<V>, HasAll<V> {
  get attribute(): KeyValueAssert {
    return new KeyValueAssertCore(AssertWhat.attribute);
  }

  get style(): KeyValueAssert {
    return new KeyValueAssertCore(AssertWhat.style);
  }

  get text(): StringAssert {
    return new StringAssertCore(AssertWhat.text);
  }

  get value(): StringAssert {
    return new StringAssertCore(AssertWhat.value);
  }

  get length(): NumberAssert {
    return new NumberAssertCore(AssertWhat.length);
  }

  get state(): BinaryAssert<ElementState> {
    return new StateAssertCore();
  }

  get class(): StringAssert {
    return new StringAssertCore(AssertWhat.class);
  }
}

export const has: Has<unknown> & HasAll<unknown> = new Assertion();