import { CanAppend, errors, qte, reinterpret } from '@skintest/common';
import { Command } from './command';
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

export function tempSuite(): [Suite, () => void] {
  const restore = currentSuite;
  currentSuite = newSuite('temp');
  
  return [
    currentSuite,
    () => currentSuite = restore
  ];
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
      throw errors.invalidOperation(`script ${qte(script.name)} is not found`);
    }

    return new ProjectScriptBuilder(this, script as RuntimeScript);
  }
}

type HowToModifyScenario = {
  append: Command[];
};

export interface ScriptBuilder {
  commit(): void;
  removeScenario(name: string): ScriptBuilder;
  modifyScenario(name: string, how: HowToModifyScenario): ScriptBuilder;
}

class ProjectScriptBuilder implements ScriptBuilder {
  private scenariosToRemove = new Set<string>();
  private scenariosToModify = new Map<string, HowToModifyScenario[]>();

  constructor(
    private suite: ProjectSuite,
    private script: RuntimeScript
  ) { }

  removeScenario(name: string): ScriptBuilder {
    this.scenariosToRemove.add(name);
    return this;
  }


  modifyScenario(name: string, how: HowToModifyScenario): ScriptBuilder {
    if (this.scenariosToModify.has(name)) {
      this.scenariosToModify.get(name)?.push(how);
    } else {
      this.scenariosToModify.set(name, [how]);
    }

    return this;
  }

  commit(): void {
    const { script } = this;
    script.version++;

    const getScenarioIndex = (scenario: string) => {
      const index = script.scenarios.findIndex(x => x.name === scenario);
      if (index < 0) {
        throw errors.invalidOperation(`${qte(scenario)} is not found in ${qte(script.name)}`);
      }

      return index;
    };

    for (const [name, modify] of this.scenariosToModify) {
      const index = getScenarioIndex(name);
      const scenario = script.scenarios[index];
      for (const how of modify) {
        if (how.append.length) {
          reinterpret<CanAppend<Command>>(scenario.steps).append(...how.append);
        }
      }
    }

    for (const name of this.scenariosToRemove) {
      const index = getScenarioIndex(name);
      script.scenarios.splice(index, 1);
    }
  }
}