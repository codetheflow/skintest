import { invalidArgumentError } from '../common/errors';
import { AssertHow, AssertWhat } from './assert';
import { DOMElement } from './dom';
import { Page } from './page';
import { Query, QueryList } from './query';
import { binaryAssertFail, notFoundElement, pass, TestExecutionResult, unaryAssertFail } from './test-result';

export class Verify {
  constructor(private page: Page) {
  }

  async element<S extends DOMElement, V>(
    query: Query<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): TestExecutionResult {
    const elementRef = await this.page.query<S>(query.toString());
    if (!elementRef) {
      return notFoundElement(query.toString());
    }

    switch (what) {
      case AssertWhat.innerText: {
        const actual = await elementRef.innerText();
        const etalon = expected as any as string;
        if (this.binaryTest(how, actual, etalon) === true) {
          return pass();
        }

        return binaryAssertFail(etalon, actual);
      }
      case AssertWhat.value: {
        const actual = await elementRef.value();
        const etalon = expected as any as string;
        if (this.binaryTest(how, actual, etalon) === true) {
          return pass();
        }

        return binaryAssertFail(etalon, actual);
      }
      case AssertWhat.focus: {
        const hasFocus = await elementRef.hasFocus();
        if (hasFocus) {
          return pass();
        }

        return unaryAssertFail('not focused');
      }
      default: {
        throw invalidArgumentError('what', what);
      }
    }
  }

  async elementList<S extends DOMElement, V>(
    selector: QueryList<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): TestExecutionResult {
    const elementRefList = await this.page.queryList<S>(selector.toString());
    switch (what) {
      case AssertWhat.length: {
        const actual = await elementRefList.length;
        const etalon = expected as any as number;
        if (this.binaryTest(how, actual, etalon)) {
          return pass();
        }

        return binaryAssertFail(etalon, actual);
      }
      default: {
        throw invalidArgumentError('what', what);
      }
    }
  }

  private binaryTest<V>(how: AssertHow, actual: V, etalon: V): boolean {
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
