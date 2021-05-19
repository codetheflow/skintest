
export enum AssertHow {
  equals = 'equals to',
  above = 'above',
  below = 'below',
  regexp = 'matches to',
}

export enum AssertWhat {
  length = 'length',
  innerText = 'text',
  focus = 'focus',
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
}

export interface NumberAssert {
  above: BinaryAssert<number>;
  below: BinaryAssert<number>;
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

export class UnaryAssertCore extends AssertHost<void> implements UnaryAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }
}
