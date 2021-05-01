import { DOMElement } from '../dom';
import { ElementRef, Engine } from '../engine';
import { Guard } from '../../common/guard';
import { Select, SelectAll } from '../selector';
import { DevStep, UIStep, StepContext } from '../command';
import { TestExecutionResult, pass } from '../test-result';

export interface Debugger {
  $<T extends DOMElement>(query: string | Select<T>): Promise<ElementRef<T> | null>;
  $$<T extends DOMElement>(query: string | SelectAll<T>): Promise<ElementRef<T>[]>;
}

export type Breakpoint = (dbg: Debugger) => Promise<void>;

class EngineDebugger implements Debugger {
  constructor(private engine: Engine) { }

  $<T extends DOMElement>(selector: string | Select<T>): Promise<ElementRef<T> | null> {
    const query = selector.toString();
    return this.engine.select<T>(query);
  }

  $$<T extends DOMElement>(selector: string | SelectAll<T>): Promise<ElementRef<T>[]> {
    const query = selector.toString();
    return this.engine.selectAll<T>(query);
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
    const { engine } = context;

    const dbg = new EngineDebugger(engine)
    await this.breakpoint(dbg);
    return pass();
  }

  toString() {
    return 'I debug';
  }
}
