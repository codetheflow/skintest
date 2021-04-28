import { DOMElement } from './dom';
import { Engine } from './engine';
import { Feature, Scenario } from './feature';

export interface Debugger {

}

class EngineDebugger implements Debugger {
  constructor(private engine: Engine) { }

  $<T extends DOMElement>(query: string): T | null {
    return this.engine.select<T>(query);
  }

  $$<T extends DOMElement>(query: string): T[] {
    return this.engine.selectAll<T>(query);
  }
}

export function __skindebug(script: (dbg: Debugger) => Feature | Scenario) {
  const dbg = new EngineDebugger(null as any);
  // script(dbg);
}