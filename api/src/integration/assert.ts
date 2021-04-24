
export enum AssertHow {
  equals,
  above,
  below,
  regexp,
}

export enum AssertWhat {
  length,
  innerText
}

export interface Assert<V> {
}

export interface AssertAll<V> {
}

export class AssertHost<V> implements Assert<V>, AssertAll<V> {
  constructor(
    public what: AssertWhat,
    public how: AssertHow
  ) { }
}

export class StringAssert extends AssertHost<string> {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get match(): Assert<RegExp> {
    return new AssertHost<string>(this.what, AssertHow.regexp);
  }
}

export class NumberAssert extends AssertHost<number> {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get above(): Assert<number> {
    return new AssertHost<number>(this.what, AssertHow.above);
  }

  get below(): Assert<number> {
    return new AssertHost<number>(this.what, AssertHow.below);
  }
}
