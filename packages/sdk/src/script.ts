import { Data, errors, Indexed, Meta } from '@skintest/common';
import { Command } from './command';
import { Feature, OnlyScenario, TestScenario } from './schema';

export type Step = [number, Command];
export type Steps = Iterable<Step>;

export interface Scenario {
  name: string;
  steps: Steps;
  attributes: Partial<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Array<Data>
  }>;
}

export interface Script {
  readonly version: number;
  readonly name: string;

  readonly scenarios: Iterable<Scenario>;
  readonly beforeFeature: Steps;
  readonly afterFeature: Steps
  readonly beforeScenario: Steps;
  readonly afterScenario: Steps;
  readonly beforeStep: Steps;
  readonly afterStep: Steps;

  getMeta(): Promise<Meta>;
}

export class RuntimeScript implements Script, Feature, TestScenario {
  private testAttributes: Scenario['attributes'] = {};

  beforeFeature = new Indexed<Command>();
  afterFeature = new Indexed<Command>();

  beforeScenario = new Indexed<Command>();
  afterScenario = new Indexed<Command>();

  beforeStep = new Indexed<Command>();
  afterStep = new Indexed<Command>()

  scenarios: Array<Scenario> = [];

  constructor(
    public name: string,
    public version: number,
    public getMeta: () => Promise<Meta>,
  ) {
  }

  test<T extends Data>(frame: 'data', ...data: T[]): OnlyScenario<T> {
    this.testAttributes = { [frame]: data };
    return this;
  }

  before(what: 'feature' | 'scenario' | 'step', ...steps: Command[]): Feature {
    switch (what) {
      case 'feature':
        this.beforeFeature.items.push(...steps);
        break;
      case 'scenario':
        this.beforeScenario.items.push(...steps);
        break;
      case 'step':
        this.beforeStep.items.push(...steps);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  after(what: 'feature' | 'scenario' | 'step', ...steps: Command[]): Feature {
    switch (what) {
      case 'feature':
        this.afterFeature.items.push(...steps);
        break;
      case 'scenario':
        this.afterScenario.items.push(...steps);
        break;
      case 'step':
        this.afterStep.items.push(...steps);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  scenario(name: string, ...steps: Command[]): TestScenario {
    this.scenarios.push({
      name,
      steps: new Indexed(steps),
      attributes: this.testAttributes,
    });

    this.testAttributes = {};
    return this;
  }
}