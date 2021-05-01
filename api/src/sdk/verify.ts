import { AssertHow, AssertWhat } from './assert';
import { DOMElement } from './dom';
import { Engine } from './engine';
import { invalidArgumentError } from '../common/errors';
import { asertFail, notFoundElement, pass, TestPass } from './test-result';
import { Select, SelectAll } from './selector';
import { TestExecutionResult, TestFail } from './test-result';

export class Verify {
  constructor(private engine: Engine) {
  }

  async element<S extends DOMElement, V>(
    selector: Select<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): TestExecutionResult {
    const elementRef = await this.engine.select<S>(selector.toString());
    if (!elementRef) {
      return notFoundElement(selector.toString());
    }

    switch (what) {
      case AssertWhat.innerText: {
        const actual = await elementRef.innerText();
        const etalon = expected as any as string;
        if (this.test(how, actual, etalon) === true) {
          return pass();
        }

        return asertFail(etalon, actual);
      }
      default: {
        throw invalidArgumentError('what', what);
      }
    }
  }

  async elements<S extends DOMElement, V>(
    selector: SelectAll<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): TestExecutionResult {
    const elementRefs = await this.engine.selectAll<S>(selector.toString());
    switch (what) {
      case AssertWhat.length: {
        const etalon = expected as any as number;
        const actual = elementRefs.length;
        if (this.test(how, actual, etalon)) {
          return pass();
        }

        return asertFail(etalon, actual);
      }
      default: {
        throw invalidArgumentError('what', what);
      }
    }

  }

  private test<V>(how: AssertHow, actual: V, etalon: V): boolean {
    switch (how) {
      case AssertHow.above: {
        return etalon > actual;
      }
      case AssertHow.below: {
        return etalon < actual;

      }
      case AssertHow.equals: {
        return etalon === actual;
      }
      case AssertHow.regexp: {
        const actualText = '' + actual;
        const regexp = etalon as any as RegExp;
        return actualText.match(regexp) !== null;
      }
      default: {
        throw invalidArgumentError('how', how);
      }
    }
  }
}
