import { errors, Guard, isRegExp, isString, KeyValue, likeKeyValue, reinterpret } from '@skintest/common';
import { AssertHost, AssertHow, AssertWhat } from './assert';
import { ElementState } from './element';
import { Page } from './page';
import { Query, QueryList } from './query';
import { fail, pass, TestResult } from './test-result';

export class Verify {
  constructor(private page: Page) {
  }

  theCondition<V>(
    query: Query | QueryList,
    assert: AssertHost,
    expected: V
  ): Promise<TestResult> {
    Guard.notNull(query, 'query');
    Guard.notNull(assert, 'assert');

    if (query.type === 'query') {
      return this.conditionOnQuery(query, assert, expected);
    }

    return this.conditionOnQueryList(query, assert, expected);
  }

  private async conditionOnQuery<V>(
    query: Query,
    assert: AssertHost,
    expected: V
  ): Promise<TestResult> {
    const selector = query.toString();
    const elementRef = await this.page.query(selector);
    if (!elementRef) {
      if (assert.what === 'state' && '' + expected === 'exists') {
        if (assert.no) {
          return pass();
        }

        return fail
          .conditionError({
            assert,
            query,
            actual: 'not exists',
            etalon: expected
          });
      }

      return fail.elementNotFound({ query });
    }


    // todo: remove copy/paste code below
    switch (assert.what) {
      case AssertWhat.text: {
        const actual = await elementRef.text();
        const etalon = reinterpret<string>(expected);
        if (this.test(assert, actual, etalon) === true) {
          return pass();
        }

        return fail
          .conditionError({
            actual,
            etalon,
            query,
            assert,
          });
      }
      case AssertWhat.state: {
        const etalon = reinterpret<ElementState>(expected);
        const actual = await elementRef.state(etalon);
        if (this.test(assert, actual, true)) {
          return pass();
        }

        return fail
          .conditionError({
            actual: assert.no ? etalon : opposite(etalon),
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

        return fail
          .conditionError({
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

          if (this.test(assert, actual, etalon)) {
            return pass();
          }

          return fail
            .conditionError({
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

          if (this.test(assert, actual, etalon)) {
            return pass();
          }

          return fail
            .conditionError({
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

  private async conditionOnQueryList<V>(
    query: QueryList,
    assert: AssertHost,
    expected: V
  ): Promise<TestResult> {
    const selector = query.toString();
    const elementRefList = await this.page.queryList(selector);
    switch (assert.what) {
      case AssertWhat.length: {
        const actual = await elementRefList.length;
        const etalon = reinterpret<number>(expected);
        if (this.test(assert, actual, etalon)) {
          return pass();
        }

        return fail
          .conditionError({
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

  private test<V>(assert: AssertHost, actual: V, etalon: V): boolean {
    let result: boolean;
    switch (assert.how) {
      case AssertHow.exists: {
        result = !!actual;
        break;
      }
      case AssertHow.above: {
        result = actual > etalon;
        break;
      }
      case AssertHow.below: {
        result = actual < etalon;
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

function opposite(state: ElementState): string {
  switch (state) {
    case 'checked': return 'unchecked';
    case 'disabled': return 'enabled';
    case 'editable': return 'not editable';
    case 'enabled': return 'disabled';
    case 'exists': return 'not exists';
    case 'focused': return 'not focused';
    case 'hidden': return 'visible';
    case 'visible': return 'not visible';
    default: throw errors.invalidArgument('state', state);
  }
}