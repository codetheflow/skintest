import { Guard } from '../../common/guard';
import { DevStep, StepContext } from '../command';
import { DOMElement } from '../dom';
import { ElementRef, ElementRefList, Page } from '../page';
import { Query, QueryList } from '../query';
import { pass, TestExecutionResult } from '../test-result';

export interface Debugger {
  $<T extends DOMElement>(query: string | Query<T>): Promise<ElementRef<T> | null>;
  $$<T extends DOMElement>(query: string | QueryList<T>): Promise<ElementRef<T>[]>;
  // todo: add inspect, pause etc.
}

export type Breakpoint = (dbg: Debugger) => Promise<void>;

class PageDebugger implements Debugger {
  constructor(private page: Page) { }

  $<T extends DOMElement>(query: string | Query<T>): Promise<ElementRef<T> | null> {
    const selector = query.toString();
    return this.page.dbgQuery<T>(selector);
  }

  $$<T extends DOMElement>(query: string | QueryList<T>): Promise<ElementRefList<T>> {
    const selector = query.toString();
    return this.page.dbgQueryList<T>(selector);
  }
}

export class DebugStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    private breakpoint: Breakpoint
  ) {
    Guard.notNull(breakpoint, 'breakpoint');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const dbg = new PageDebugger(page)
    await this.breakpoint(dbg);
    return pass();
  }

  toString() {
    return 'I debug';
  }
}
