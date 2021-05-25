import { errors, isString, KeyValue, reinterpret } from '@skintest/common';
import { AssertHow, AssertWhat } from './assert';
import { DOMElement } from './dom';
import { ElementState } from './element';
import { Page } from './page';
import { Query, QueryList } from './query';
import { fails, pass, TestExecutionResult } from './test-result';

export class Verify {
  constructor(private page: Page) {
  }

  async element<S extends DOMElement, V>(
    query: Query<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): Promise<TestExecutionResult> {
    const selector = query.toString();
    const elementRef = await this.page.query<S>(selector);
    if (!elementRef) {
      return fails.elementNotFound({ query });
    }

    switch (what) {
      case AssertWhat.text: {
        const actual = await elementRef.innerText();
        const etalon = reinterpret<string>(expected);
        if (this.binaryTest(how, actual, etalon) === true) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            how,
            query,
            what,
          });
      }
      case AssertWhat.value: {
        const actual = await elementRef.value();
        const etalon = reinterpret<string>(expected);
        if (this.binaryTest(how, actual, etalon) === true) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            how,
            query,
            what,
          });
      }
      case AssertWhat.state: {
        const etalon = reinterpret<ElementState>(expected);
        const actual = await elementRef.state(etalon);
        if (actual) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual: '' + actual,
            etalon,
            how,
            query,
            what,
          });
      }
      case AssertWhat.class: {
        const etalon = reinterpret<string>(expected);
        const classList = await elementRef.classList();
        if (classList.has(etalon)) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual: classList.toString(),
            etalon,
            how,
            query,
            what,
          });
      }
      case AssertWhat.attribute: {
        if (isString(expected)) {
          const etalon = reinterpret<string>(expected);
          const actual = await elementRef.attribute(etalon);
          if (this.binaryTest(how, actual, etalon)) {
            return pass();
          }

          return fails
            .binaryAssert({
              actual,
              etalon,
              how,
              query,
              what,
            });
        }

        const [name, etalon] = reinterpret<KeyValue<string>>(expected);
        const actual = await elementRef.attribute(name);
        if (actual === etalon) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            how,
            query,
            what,
          });
      }

      case AssertWhat.style: {
        if (isString(expected)) {
          const etalon = reinterpret<string>(expected);
          const actual = await elementRef.style(etalon);
          if (this.binaryTest(how, actual, etalon)) {
            return pass();
          }

          return fails
            .binaryAssert({
              actual,
              etalon,
              how,
              query,
              what,
            });
        }

        const [name, etalon] = reinterpret<KeyValue<string>>(expected);
        const actual = await elementRef.style(name);
        if (actual === etalon) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            how,
            query,
            what,
          });
      }
      default: {
        throw errors.invalidArgument('what', what);
      }
    }
  }

  async elementList<S extends DOMElement, V>(
    query: QueryList<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): Promise<TestExecutionResult> {
    const selector = query.toString();
    const elementRefList = await this.page.queryList<S>(selector);
    switch (what) {
      case AssertWhat.length: {
        const actual = await elementRefList.length;
        const etalon = reinterpret<number>(expected);
        if (this.binaryTest(how, actual, etalon)) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            how,
            query,
            what,
          });
      }
      default: {
        throw errors.invalidArgument('what', what);
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
        const regexp = reinterpret<RegExp>(etalon);
        return actualText.match(regexp) !== null;
      }
      default: {
        throw errors.invalidArgument('how', how);
      }
    }
  }
}