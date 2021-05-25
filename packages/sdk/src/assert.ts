import { KeyValue } from '@skintest/common';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class BinaryAssert<V> {
  private type = 'binary';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class ListBinaryAssert<V> {
  private type = 'list-binary';
}

export abstract class StringAssert extends BinaryAssert<string> {
  abstract match: BinaryAssert<RegExp>;
  abstract like: BinaryAssert<string>;
}

export abstract class NumberAssert extends BinaryAssert<number> {
  abstract above: BinaryAssert<number>;
  abstract below: BinaryAssert<number>;
}

export abstract class KeyValueAssert extends BinaryAssert<KeyValue<string>> {
  abstract match: StringAssert['match'];
  abstract like: StringAssert['like'];
}

export abstract class ListNumberAssert extends ListBinaryAssert<number> {
  abstract above: ListBinaryAssert<number>;
  abstract below: ListBinaryAssert<number>;
}

export interface AssertHost {
  what: AssertWhat;
  how: AssertHow;
}

export class BinaryAssertHost<V> extends BinaryAssert<V> implements AssertHost {
  constructor(
    public what: AssertWhat,
    public how: AssertHow,
  ) {
    super();
  }
}

export class ListBinaryAssertHost<V> extends ListBinaryAssert<V> implements AssertHost {
  constructor(
    public what: AssertWhat,
    public how: AssertHow,
  ) {
    super();
  }
}

export class StringAssertHost<V = string> extends BinaryAssertHost<V> implements StringAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get match(): BinaryAssert<RegExp> {
    return new BinaryAssertHost(this.what, AssertHow.regexp);
  }

  get like(): BinaryAssert<V> {
    return new BinaryAssertHost(this.what, AssertHow.contains);
  }
}

export class NumberAssertHost<V = number> extends BinaryAssertHost<V> implements NumberAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get above(): BinaryAssert<number> {
    return new BinaryAssertHost(this.what, AssertHow.above);
  }

  get below(): BinaryAssert<number> {
    return new BinaryAssertHost(this.what, AssertHow.below);
  }
}


export class ListNumberAssertHost<V = number> extends ListBinaryAssertHost<V> implements ListNumberAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get above(): ListBinaryAssert<number> {
    return new ListBinaryAssertHost(this.what, AssertHow.above);
  }

  get below(): ListBinaryAssert<number> {
    return new ListBinaryAssertHost(this.what, AssertHow.below);
  }
}

export class KeyValueAssertHost<V = KeyValue<string>> extends BinaryAssertHost<V> implements KeyValueAssert {
  constructor(what: AssertWhat) {
    super(what, AssertHow.equals);
  }

  get match(): BinaryAssert<RegExp> {
    return new BinaryAssertHost(this.what, AssertHow.regexp);
  }

  get like(): BinaryAssert<string> {
    return new BinaryAssertHost(this.what, AssertHow.contains);
  }
}