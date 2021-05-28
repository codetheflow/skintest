import { AssertHow, AssertWhat, BinaryAssertHost, KeyValueAssert, KeyValueAssertHost, ListNumberAssert, ListNumberAssertHost, StateAssert, StringAssert, StringAssertHost } from './assert';
import { ElementState } from './element';

export interface Has {
  no: HasNo;
  class: StringAssert;
  state: StateAssert,
  attribute: KeyValueAssert;
  style: KeyValueAssert;
  text: StringAssert;
}

export interface ListHas {
  no: ListHasNo;
  length: ListNumberAssert;
}

export type HasNo = Omit<Has, 'not'>;
export type ListHasNo = Omit<ListHas, 'not'>;

class Assertion implements Has, ListHas {
  private not = false;

  get no() {
    const negative = new Assertion();
    negative.not = true;
    return negative;
  }

  get attribute(): KeyValueAssert {
    return new KeyValueAssertHost(this.not, AssertWhat.attribute);
  }

  get style(): KeyValueAssert {
    return new KeyValueAssertHost(this.not, AssertWhat.style);
  }

  get text(): StringAssert {
    return new StringAssertHost(this.not, AssertWhat.text);
  }

  get length(): ListNumberAssert {
    return new ListNumberAssertHost(this.not, AssertWhat.length);
  }

  get state(): StateAssert {
    return new BinaryAssertHost<ElementState>(this.not, AssertWhat.state, AssertHow.equals);
  }

  get class(): StringAssert {
    return new StringAssertHost(this.not, AssertWhat.class);
  }
}

export const has: Has & ListHas = new Assertion();