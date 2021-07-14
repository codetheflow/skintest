import { errors, qte } from '@skintest/common';
import { RuntimeScript, Script } from './script';

// todo: apply immutable approach
// todo: better currentSuite management

let currentSuite: Suite;

export function newSuite(uri: string): Suite {
  const suite = new ProjectSuite(uri);
  currentSuite = suite;
  return suite;
}

export function getSuite(): Suite {
  return currentSuite;
}


export interface Suite {
  readonly uri: string;

  addScript(script: Script): void;
  editScript(script: Script): ScriptBuilder;
  getScripts(): Script[];
}

class ProjectSuite implements Suite {
  private scripts: Script[] = [];

  constructor(public uri: string) {
  }

  addScript(script: Script): void {
    this.scripts.push(script);
  }

  getScripts(): Script[] {
    return Array.from(this.scripts);
  }

  editScript(script: Script): ScriptBuilder {
    if (!this.scripts.includes(script)) {
      throw errors.constraint(`script ${qte(script.name)} is not found`);
    }

    return new ProjectScriptBuilder(this, script as RuntimeScript);
  }
}

export interface ScriptBuilder {
  commit(): void;
  removeScenario(name: string): ScriptBuilder;
}

class ProjectScriptBuilder implements ScriptBuilder {
  private scenariosToRemove = new Set<string>();

  constructor(
    private suite: ProjectSuite,
    private script: RuntimeScript
  ) { }

  removeScenario(name: string): ScriptBuilder {
    this.scenariosToRemove.add(name);
    return this;
  }

  commit(): void {
    const { script } = this;
    script.version++;
    for (const scenario of this.scenariosToRemove) {
      const index = script.scenarios.findIndex(x => x.name === scenario);
      if (index < 0) {
        throw errors.constraint(`${qte(scenario)} is not found in ${qte(script.name)}`);
      }

      script.scenarios.splice(index, 1);
    }
  }
}