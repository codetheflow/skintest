
export enum AssertHow {
  equals = 'equals',
  above = 'above',
  below = 'below',
  regexp = 'matches',
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

export class AssertHost<V> implements UnaryAssert, BinaryAssert<V>, ListAssert<V> {
  constructor(
    public what: AssertWhat,
    public how: AssertHow
  ) { }
}

export class StringAssert extends AssertHost<string> {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get match(): BinaryAssert<RegExp> {
    return new AssertHost<string>(this.what, AssertHow.regexp);
  }
}

export class NumberAssert extends AssertHost<number> {
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

export class BooleanAssert extends AssertHost<void> {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }
}
