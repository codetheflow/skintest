import { AssertHow, AssertWhat } from './assert';
import { Select, SelectAll } from './selector';
import { Engine } from './engine';
import { error } from '../utils/error';
import { DOMElement } from './dom';

export class Stage {
  constructor(private engine: Engine) {
  }

  async test<S extends DOMElement, V>(
    selector: Select<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ) {
    const element = await this.engine.select<S>(selector.query) as any as HTMLElement;
    switch (what) {
      case AssertWhat.innerText: {
        const expectedText = expected as any as string;
        this.assert(how, element.innerText, expectedText);
        break;
      }
      default: {
        throw error('test', `invalid argument ${what}`);
      }
    }
  }

  async testAll<S extends DOMElement, V>(
    selector: SelectAll<S>,
    what: AssertWhat,
    how: AssertHow,
    expected: V
  ) {
    const elements = await this.engine.selectAll<S>(selector.query) as any[];
    switch (what) {
      case AssertWhat.length: {
        const expectedLength = expected as any as number;
        this.assert(how, elements.length, expectedLength);
        break;
      }
      default: {
        throw error('test', `invalid argument ${what}`);
      }
    }

  }

  private assert<V>(how: AssertHow, actual: V, etalon: V) {
    switch (how) {
      case AssertHow.above: {

      }
      case AssertHow.below: {

      }
      case AssertHow.equals: {
        this.throwIfFalse(actual === etalon);
        break;
      }
      case AssertHow.regexp: {

      }
      default: {
        throw error('test', `invalid argument ${how}`);
      }
    }
  }


  private throwIfFalse(condition: boolean): void {
    if (!condition) {
      throw error('test', 'condition is false');
    }
  }
}
