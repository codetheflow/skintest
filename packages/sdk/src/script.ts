import { errors, Meta, Serializable } from '@skintest/common';
import { Command } from './command';
import { Feature, OnlyScenario, TestScenario } from './schema';

export interface Scenario {
  name: string;
  commands: Command[];
  attributes: Partial<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Array<Serializable>
  }>;
}

export interface Script {
  readonly name: string;

  readonly scenarios: ReadonlyArray<Scenario>;
  readonly beforeFeature: ReadonlyArray<Command>;
  readonly afterFeature: ReadonlyArray<Command>
  readonly beforeScenario: ReadonlyArray<Command>;
  readonly afterScenario: ReadonlyArray<Command>;
  readonly beforeStep: ReadonlyArray<Command>;
  readonly afterStep: ReadonlyArray<Command>;

  getMeta(): Promise<Meta>;
}


export class RuntimeScript implements Script, Feature, TestScenario {
  private testAttributes: Scenario['attributes'] = {};

  beforeFeature: Command[] = [];
  afterFeature: Command[] = []

  beforeScenario: Command[] = [];
  afterScenario: Command[] = [];

  beforeStep: Command[] = [];
  afterStep: Command[] = [];

  scenarios: Array<Scenario> = [];

  constructor(
    public name: string,
    public getMeta: () => Promise<Meta>,
  ) {
  }

  test<T extends Serializable>(frame: 'data', ...data: T[]): OnlyScenario<T> {
    this.testAttributes = { [frame]: data };
    return this;
  }

  before(what: 'feature' | 'scenario' | 'step', ...steps: Command[]): Feature {
    switch (what) {
      case 'feature':
        this.beforeFeature.push(...steps);
        break;
      case 'scenario':
        this.beforeScenario.push(...steps);
        break;
      case 'step':
        this.beforeStep.push(...steps);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  after(what: 'feature' | 'scenario' | 'step', ...steps: Command[]): Feature {
    switch (what) {
      case 'feature':
        this.afterFeature.push(...steps);
        break;
      case 'scenario':
        this.afterScenario.push(...steps);
        break;
      case 'step':
        this.afterStep.push(...steps);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  scenario(name: string, ...steps: Command[]): TestScenario {
    this.scenarios.push({
      name,
      commands: steps,
      attributes: this.testAttributes,
    });

    this.testAttributes = {};
    return this;
  }
}