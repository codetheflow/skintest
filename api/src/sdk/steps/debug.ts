import { DOMElement } from '../dom';
import { ElementRef, ElementRefList, Driver } from '../driver';
import { Guard } from '../../common/guard';
import { Query, QueryList } from '../query';
import { DevStep, ClientStep, StepContext } from '../command';
import { TestExecutionResult, pass } from '../test-result';

export interface Debugger {
  $<T extends DOMElement>(query: string | Query<T>): Promise<ElementRef<T> | null>;
  $$<T extends DOMElement>(query: string | QueryList<T>): Promise<ElementRef<T>[]>;
}

export type Breakpoint = (dbg: Debugger) => Promise<void>;

class DriverDebugger implements Debugger {
  constructor(private driver: Driver) { }

  $<T extends DOMElement>(query: string | Query<T>): Promise<ElementRef<T> | null> {
    const selector = query.toString();
    return this.driver.select<T>(selector);
  }

  $$<T extends DOMElement>(query: string | QueryList<T>): Promise<ElementRefList<T>> {
    const selector = query.toString();
    return this.driver.selectAll<T>(selector);
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
    const { driver } = context;

    const dbg = new DriverDebugger(driver)
    await this.breakpoint(dbg);
    return pass();
  }

  toString() {
    return 'I debug';
  }
}
