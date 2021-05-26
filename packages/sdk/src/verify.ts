import { errors, isRegExp, isString, KeyValue, likeKeyValue, reinterpret } from '@skintest/common';
import { AssertHow, AssertWhat } from './assert';
import { DOMElement } from './dom';
import { ElementState } from './element';
import { Page } from './page';
import { Query, QueryList } from './query';
import { fails, pass, TestExecutionResult } from './test-result';

export class Verify {
  constructor(private page: Page) {
  }

  async element<V>(
    query: Query,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): Promise<TestExecutionResult> {
    const selector = query.toString();
    const elementRef = await this.page.query(selector);
    if (!elementRef) {
      return fails.elementNotFound({ query });
    }

    // todo: remove copy/paste code below
    switch (what) {
      case AssertWhat.text: {
        const actual = await elementRef.text();
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
      case AssertWhat.attribute:
      case AssertWhat.style: {
        const getActual = (name: string) =>
          what === AssertWhat.attribute
            ? elementRef.attribute(name)
            : elementRef.style(name);

        if (isString(expected)) {
          const etalon = reinterpret<string>(expected);
          const actual = await getActual(etalon);
          how = AssertHow.exists;

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

        if (likeKeyValue(expected)) {
          const [name, etalon] = reinterpret<KeyValue<string>>(expected);
          const actual = await getActual(name);
          if (!isString(etalon)) {
            how = AssertHow.like;
          }

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

        throw errors.invalidArgument('expected', expected);
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
      case AssertHow.exists: {
        return !!actual;
      }
      case AssertHow.above: {
        return etalon > actual;
      }
      case AssertHow.below: {
        return etalon < actual;

      }
      case AssertHow.equals: {
        return etalon === actual;
      }
      case AssertHow.like: {
        if (isString(etalon)) {
          return ('' + actual).includes('' + etalon);
        }

        if (isRegExp(etalon)) {
          const actualText = '' + actual;
          const regexp = reinterpret<RegExp>(etalon);
          return actualText.match(regexp) !== null;
        }

        throw errors.invalidArgument('etalon', etalon);
      }
      default: {
        throw errors.invalidArgument('how', how);
      }
    }
  }
}