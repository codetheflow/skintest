import { AssertHow, AssertWhat } from './assert';
import { Select, SelectAll } from './selector';
import { Engine } from './engine';
import { DOMElement } from './dom';
import { TestExecutionResult, TestFail } from './test-result';
import { invalidArgumentError } from '../common/errors';

export class Verify {
  constructor(private engine: Engine) {
  }

  async element<S extends DOMElement, V>(
    selector: Select<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ): TestExecutionResult {
    const element = await this.engine.select<S>(selector.query) as any as HTMLElement;
    switch (what) {
      case AssertWhat.innerText: {
        const expectedText = expected as any as string;
        return this.assert(how, element.innerText, expectedText);
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
    const elements = await this.engine.selectAll<S>(selector.query) as any[];
    switch (what) {
      case AssertWhat.length: {
        const expectedLength = expected as any as number;
        return this.assert(how, elements.length, expectedLength);
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

        return {
          code: 'NOT_EQUALS_ERROR',
          description: '',
          solution: ''
        };
      }
      case AssertHow.regexp: {

      }
      default: {
        throw invalidArgumentError('how', how);
      }
    }
  }
}
