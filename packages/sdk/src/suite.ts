import { yes } from '@skintest/common';
import { Script } from './script';

export interface Suite {
  readonly uri: string;
  readonly operations: SuiteOperations;

  addScript(script: Script): void;
  getScripts(): Script[];
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

  constructor(public uri: string) {
  }

  addScript(script: Script): void {
    this.scripts.push(script);
  }

  getScripts(): Script[] {
    return Array.from(this.scripts);
  }
}

let currentSuite: Suite;

export function newSuite(uri: string): Suite {
  const suite = new ProjectSuite(uri);
  currentSuite = suite;
  return suite;
}

export function getSuite(): Suite {
  return currentSuite;
}