import { errors } from '@skintest/common';
import { Command } from './command';
import { Feature, Scenario } from './feature';
import { Meta } from './meta';
import { ScenarioSchema, StorySchema } from './schema';

export interface Script {
  readonly name: string;

  readonly scenarios: ReadonlyArray<[string, ReadonlyArray<Command>]>;
  readonly beforeFeature: ReadonlyArray<Command>;
  readonly afterFeature: ReadonlyArray<Command>
  readonly beforeScenario: ReadonlyArray<Command>;
  readonly afterScenario: ReadonlyArray<Command>;
  readonly beforeStep: ReadonlyArray<Command>;
  readonly afterStep: ReadonlyArray<Command>;

  getMeta(): Promise<Meta>;
}

export class RuntimeScript implements Script, Feature, Scenario {
  beforeFeature: Command[] = [];
  afterFeature: Command[] = []

  beforeScenario: Command[] = [];
  afterScenario: Command[] = [];

  beforeStep: Command[] = [];
  afterStep: Command[] = [];

  scenarios: Array<[string, Command[]]> = [];

  constructor(
    public name: string,
    public getMeta: () => Promise<Meta>,
  ) {
  }

  before(what: 'feature' | 'scenario' | 'step', ...schema: StorySchema): Feature {
    switch (what) {
      case 'feature':
        this.beforeFeature.push(...schema);
        break;
      case 'scenario':
        this.beforeScenario.push(...schema);
        break;
      case 'step':
        this.beforeStep.push(...schema);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  after(what: 'feature' | 'scenario' | 'step', ...schema: StorySchema): Feature {
    switch (what) {
      case 'feature':
        this.afterFeature.push(...schema);
        break;
      case 'scenario':
        this.afterScenario.push(...schema);
        break;
      case 'step':
        this.afterStep.push(...schema);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  scenario(name: string, ...schema: ScenarioSchema): Scenario {
    this.scenarios.push([name, schema]);
    return this;
  }
}