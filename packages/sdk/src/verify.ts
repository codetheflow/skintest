import { errors, isRegExp, isString, KeyValue, likeKeyValue, reinterpret } from '@skintest/common';
import { AssertHost, AssertHow, AssertWhat } from './assert';
import { ElementState } from './element';
import { Page } from './page';
import { Query, QueryList } from './query';
import { fails, pass, TestExecutionResult } from './test-result';

export class Verify {
  constructor(private page: Page) {
  }

  async query<V>(
    assert: AssertHost,
    query: Query,
    expected: V
  ): Promise<TestExecutionResult> {
    const selector = query.toString();
    const elementRef = await this.page.query(selector);
    if (!elementRef) {
      return fails.elementNotFound({ query });
    }

    // todo: remove copy/paste code below
    switch (assert.what) {
      case AssertWhat.text: {
        const actual = await elementRef.text();
        const etalon = reinterpret<string>(expected);
        if (this.binaryTest(assert, actual, etalon) === true) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            query,
            assert,
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
            query,
            assert,
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
            query,
            assert,
          });
      }
      case AssertWhat.attribute:
      case AssertWhat.style: {
        const getActual = (name: string) =>
          assert.what === AssertWhat.attribute
            ? elementRef.attribute(name)
            : elementRef.style(name);

        if (isString(expected)) {
          const etalon = reinterpret<string>(expected);
          const actual = await getActual(etalon);
          assert.how = AssertHow.exists;

          if (this.binaryTest(assert, actual, etalon)) {
            return pass();
          }

          return fails
            .binaryAssert({
              actual,
              etalon,
              query,
              assert,
            });
        }

        if (likeKeyValue(expected)) {
          const [name, etalon] = reinterpret<KeyValue<string>>(expected);
          const actual = await getActual(name);
          if (!isString(etalon)) {
            assert.how = AssertHow.like;
          }

          if (this.binaryTest(assert, actual, etalon)) {
            return pass();
          }

          return fails
            .binaryAssert({
              actual,
              etalon,
              query,
              assert,
            });
        }

        throw errors.invalidArgument('expected', expected);
      }
      default: {
        throw errors.invalidArgument('what', assert.what);
      }
    }
  }

  async queryList<V>(
    assert: AssertHost,
    query: QueryList,
    expected: V
  ): Promise<TestExecutionResult> {
    const selector = query.toString();
    const elementRefList = await this.page.queryList(selector);
    switch (assert.what) {
      case AssertWhat.length: {
        const actual = await elementRefList.length;
        const etalon = reinterpret<number>(expected);
        if (this.binaryTest(assert, actual, etalon)) {
          return pass();
        }

        return fails
          .binaryAssert({
            actual,
            etalon,
            query,
            assert,
          });
      }
      default: {
        throw errors.invalidArgument('what', assert.what);
      }
    }
  }

  private binaryTest<V>(assert: AssertHost, actual: V, etalon: V): boolean {
    let result: boolean;
    switch (assert.how) {
      case AssertHow.exists: {
        result = !!actual;
        break;
      }
      case AssertHow.above: {
        result = etalon > actual;
        break;
      }
      case AssertHow.below: {
        result = etalon < actual;
        break;
      }
      case AssertHow.equals: {
        result = etalon === actual;
        break;
      }
      case AssertHow.like: {
        if (isString(etalon)) {
          result = ('' + actual).includes('' + etalon);
          break;
        }

        if (isRegExp(etalon)) {
          const actualText = '' + actual;
          const regexp = reinterpret<RegExp>(etalon);
          result = actualText.match(regexp) !== null;
          break;
        }

        throw errors.invalidArgument('etalon', etalon);
      }
      default: {
        throw errors.invalidArgument('how', assert.how);
      }
    }

    return assert.no ? !result : result;
  }
}