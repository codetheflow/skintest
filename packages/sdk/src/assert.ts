import { KeyValue } from '@skintest/common';
import { ElementState } from './element';

export enum AssertHow {
  above = 'be above',
  below = 'be below',
  contains = 'contain',
  equals = 'equal',
  regexp = 'match',
}

export enum AssertWhat {
  attribute = 'attribute',
  class = 'class',
  length = 'length',
  state = 'state',
  style = 'style',
  text = 'text',
  value = 'value',
}

export interface UnaryAssert {
}

export interface BinaryAssert<V> {
}

export interface ListAssert<V> {
}

export interface StringAssert {
  match: BinaryAssert<RegExp>;
  like: BinaryAssert<string>;
}

export interface NumberAssert {
  above: BinaryAssert<number>;
  below: BinaryAssert<number>;
}

export interface KeyValueAssert extends BinaryAssert<KeyValue<string>> {
  match: StringAssert['match'];
  like: StringAssert['like'];
}

export class AssertHost<V> implements UnaryAssert, BinaryAssert<V>, ListAssert<V> {
  constructor(
    public what: AssertWhat,
    public how: AssertHow
  ) { }
}

export class StringAssertCore extends AssertHost<string> implements StringAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get match(): BinaryAssert<RegExp> {
    return new AssertHost<string>(this.what, AssertHow.regexp);
  }

  get like(): BinaryAssert<string> {
    return new AssertHost<string>(this.what, AssertHow.contains);
  }
}

export class NumberAssertCore extends AssertHost<number> implements NumberAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get above(): BinaryAssert<number> {
    return new AssertHost<number>(this.what, AssertHow.above);
  }

  get below(): BinaryAssert<number> {
    return new AssertHost<number>(this.what, AssertHow.below);
  }
}

export class StateAssertCore extends AssertHost<ElementState> {
  constructor() {
    super(AssertWhat.state, AssertHow.equals)
  }
}

export class KeyValueAssertCore extends StringAssertCore {
  constructor(what: AssertWhat) {
    super(what);
  }
}

export class UnaryAssertCore extends AssertHost<void> implements UnaryAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }
}
