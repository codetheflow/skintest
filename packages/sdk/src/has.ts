import { AssertHow, AssertWhat, BinaryAssert, BinaryAssertHost, KeyValueAssert, KeyValueAssertHost, ListNumberAssert, ListNumberAssertHost, StringAssert, StringAssertHost } from './assert';
import { ElementState } from './element';

export interface Has {
  class: StringAssert;
  state: BinaryAssert<ElementState>;
  attribute: KeyValueAssert;
  style: KeyValueAssert;
  text: StringAssert;
  value: StringAssert;
}

export interface ListHas {
  length: ListNumberAssert;
}

class Assertion implements Has, ListHas {
  get attribute(): KeyValueAssert {
    return new KeyValueAssertHost(AssertWhat.attribute);
  }

  get style(): KeyValueAssert {
    return new KeyValueAssertHost(AssertWhat.style);
  }

  get text(): StringAssert {
    return new StringAssertHost(AssertWhat.text);
  }

  get value(): StringAssert {
    return new StringAssertHost(AssertWhat.value);
  }

  get length(): ListNumberAssert {
    return new ListNumberAssertHost(AssertWhat.length);
  }

  get state(): BinaryAssert<ElementState> {
    return new BinaryAssertHost<ElementState>(AssertWhat.state, AssertHow.equals);
  }

  get class(): StringAssert {
    return new StringAssertHost(AssertWhat.class);
  }
}

export const has: Has & ListHas = new Assertion();