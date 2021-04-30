import { Script } from './script';

export interface Suite {
  readonly name: string;
  addScript(script: Script): void;
  getScripts(): Script[];
}

class ProjectSuite implements Suite {
  private scripts: Script[] = [];

  constructor(public readonly name: string) {
  }

  addScript(script: Script): void {
    this.scripts.push(script);
  }

  getScripts(): Script[] {
    return Array.from(this.scripts);
  }
}

let currentSuite: Suite;

export function newSuite(name: string): Suite {
  const suite = new ProjectSuite(name);
  currentSuite = suite;
  return suite;
}

export function getSuite(): Suite {
  return currentSuite;
}
