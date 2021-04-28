import { AssertHow, AssertWhat } from './assert';
import { DOMElement } from './dom';
import { Engine } from './engine';
import { invalidArgumentError } from '../common/errors';
import { notEqualsFail, notFoundElementFail } from './fails';
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
      return notFoundElementFail(selector.toString());
    }

    switch (what) {
      case AssertWhat.innerText: {
        const actualValue = await elementRef.innerText();
        const expectedValue = expected as any as string;
        return this.assert(how, actualValue, expectedValue);
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
        const expectedLength = expected as any as number;
        return this.assert(how, elementRefs.length, expectedLength);
      }
      default: {
        throw invalidArgumentError('what', what);
      }
    }

  }

  private assert<V>(how: AssertHow, actual: V, etalon: V): TestFail | null {
    switch (how) {
      case AssertHow.above: {

      }
      case AssertHow.below: {

      }
      case AssertHow.equals: {
        if (actual === etalon) {
          return null;
        }

        return notEqualsFail(etalon, actual);
      }
      case AssertHow.regexp: {

      }
      default: {
        throw invalidArgumentError('how', how);
      }
    }
  }
}
