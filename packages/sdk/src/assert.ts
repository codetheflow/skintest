import { KeyValue } from '@skintest/common';
import { ElementState } from './element';

export enum AssertHow {
  above = 'be above',
  below = 'be below',
  equals = 'equal',
  like = 'be like',
  exists = 'exist for',
}

export enum AssertWhat {
  attribute = 'attribute',
  class = 'class',
  length = 'length',
  state = 'state',
  style = 'style',
  text = 'text',
}

export abstract class BinaryAssert<V> {
  // we need to keep something with type V, to turn on type checking
  // todo: investigate better solution
  private token?: V;
}

export abstract class ListBinaryAssert<V> {
  private token?: V;
}

export abstract class StringAssert extends BinaryAssert<string> {
  abstract like: BinaryAssert<string | RegExp>;
}

export abstract class NumberAssert extends BinaryAssert<number> {
  abstract above: BinaryAssert<number>;
  abstract below: BinaryAssert<number>;
}

export abstract class KeyValueAssert extends BinaryAssert<KeyValue<string | RegExp> | string> {
  abstract like: StringAssert['like'];
}

export type ListNumberAssert = ListBinaryAssert<number> & {
  above: ListBinaryAssert<number>,
  below: ListBinaryAssert<number>,
}

export type StateAssert = BinaryAssert<ElementState>;

export interface AssertHost {
  no: boolean;
  what: AssertWhat;
  how: AssertHow;
}

export class BinaryAssertHost<V> extends BinaryAssert<V> implements AssertHost {
  constructor(
    public no: boolean,
    public what: AssertWhat,
    public how: AssertHow,
  ) {
    super();
  }
}

export class ListBinaryAssertHost<V> extends ListBinaryAssert<V> implements AssertHost {
  constructor(
    public no: boolean,
    public what: AssertWhat,
    public how: AssertHow,
  ) {
    super();
  }
}

export class StringAssertHost extends BinaryAssertHost<string> implements StringAssert {
  constructor(no: boolean, what: AssertWhat) {
    super(no, what, AssertHow.equals);
  }

  get like(): BinaryAssert<string | RegExp> {
    return new BinaryAssertHost(this.no, this.what, AssertHow.like);
  }
}

export class NumberAssertHost extends BinaryAssertHost<number> implements NumberAssert {
  constructor(no: boolean, what: AssertWhat) {
    super(no, what, AssertHow.equals);
  }

  get above(): BinaryAssert<number> {
    return new BinaryAssertHost(this.no, this.what, AssertHow.above);
  }

  get below(): BinaryAssert<number> {
    return new BinaryAssertHost(this.no, this.what, AssertHow.below);
  }
}

export class ListNumberAssertHost extends ListBinaryAssertHost<number> implements ListNumberAssert {
  constructor(no: boolean, what: AssertWhat) {
    super(no, what, AssertHow.equals);
  }

  get above(): ListBinaryAssert<number> {
    return new ListBinaryAssertHost(this.no, this.what, AssertHow.above);
  }

  get below(): ListBinaryAssert<number> {
    return new ListBinaryAssertHost(this.no, this.what, AssertHow.below);
  }
}

export class KeyValueAssertHost extends BinaryAssertHost<string | KeyValue<string>> implements KeyValueAssert {
  constructor(no: boolean, what: AssertWhat) {
    super(no, what, AssertHow.equals);
  }

  get like(): BinaryAssert<string | RegExp> {
    return new BinaryAssertHost(this.no, this.what, AssertHow.like);
  }
}