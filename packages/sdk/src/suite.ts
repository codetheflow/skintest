import { yes } from '@skintest/common';
import { Script } from './script';

export interface Suite {
  readonly name: string;

  addScript(script: Script): void;
  getScripts(): Script[];

  operations: SuiteOperations;
}

export interface SuiteOperations {
  filterFeature: (feature: string) => boolean;
  filterScenario: (feature: string, scenario: string) => boolean; 
}

class ProjectSuite implements Suite {
  private scripts: Script[] = [];

  operations = {
    filterScript: yes,
    filterFeature: yes,
    filterScenario: yes,
  };

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
