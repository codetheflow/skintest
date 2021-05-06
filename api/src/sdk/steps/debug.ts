import { DOMElement } from '../dom';
import { ElementRef, ElementRefList, PageDriver } from '../page-driver';
import { Guard } from '../../common/guard';
import { Query, QueryList } from '../query';
import { DevStep, StepContext } from '../command';
import { TestExecutionResult, pass } from '../test-result';

export interface Debugger {
  $<T extends DOMElement>(query: string | Query<T>): Promise<ElementRef<T> | null>;
  $$<T extends DOMElement>(query: string | QueryList<T>): Promise<ElementRef<T>[]>;
}

export type Breakpoint = (dbg: Debugger) => Promise<void>;

class PageDriverDebugger implements Debugger {
  constructor(private page: PageDriver) { }

  $<T extends DOMElement>(query: string | Query<T>): Promise<ElementRef<T> | null> {
    const selector = query.toString();
    return this.page.query<T>(selector);
  }

  $$<T extends DOMElement>(query: string | QueryList<T>): Promise<ElementRefList<T>> {
    const selector = query.toString();
    return this.page.queryList<T>(selector);
  }
}

export class DebugStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    private breakpoint: Breakpoint
  ) {
    Guard.notNull(breakpoint, 'breakpoint');
  }

  async execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    const dbg = new PageDriverDebugger(page)
    await this.breakpoint(dbg);
    return pass();
  }

  toString() {
    return 'I debug';
  }
}
