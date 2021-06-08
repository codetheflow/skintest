import { Guard } from '@skintest/common';
import { DevStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { DOMElement } from '../dom';
import { ElementRef, ElementRefList } from '../element';
import { StepMeta } from '../meta';
import { Page } from '../page';
import { Query, QueryList } from '../query';

export interface Debugger {
  $<E extends DOMElement>(query: string | Query<E>): Promise<ElementRef<E> | null>;
  $$<E extends DOMElement>(query: string | QueryList<E>): Promise<ElementRef<E>[]>;
  //inspect()
}

export type Breakpoint = (dbg: Debugger) => Promise<void>;

class PageDebugger implements Debugger {
  constructor(private page: Page) { }

  $<E extends DOMElement>(query: string | Query<E>): Promise<ElementRef<E> | null> {
    const selector = query.toString();
    return this.page.immediateQuery<E>(selector);
  }

  $$<E extends DOMElement>(query: string | QueryList<E>): Promise<ElementRefList<E>> {
    const selector = query.toString();
    return this.page.immediateQueryList<E>(selector);
  }
}

export class DebugStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private breakpoint: Breakpoint
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(breakpoint, 'breakpoint');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const dbg = new PageDebugger(page);
    await this.breakpoint(dbg);
    return methodResult(Promise.resolve());
  }

  toString(): string {
    return '__debug';
  }
}