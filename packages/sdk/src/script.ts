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
  readonly path: string;

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

  name = '';
  path = '';

  beforeFeature = new Indexed<Command>();
  afterFeature = new Indexed<Command>();

  beforeScenario = new Indexed<Command>();
  afterScenario = new Indexed<Command>();

  beforeStep = new Indexed<Command>();
  afterStep = new Indexed<Command>()

  scenarios: Array<Scenario> = [];

  constructor(
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
        this.beforeFeature.append(...steps);
        break;
      case 'scenario':
        this.beforeScenario.append(...steps);
        break;
      case 'step':
        this.beforeStep.append(...steps);
        break;
      default:
        throw errors.invalidArgument('what', what);
    }

    return this;
  }

  after(what: 'feature' | 'scenario' | 'step', ...steps: Command[]): Feature {
    switch (what) {
      case 'feature':
        this.afterFeature.append(...steps);
        break;
      case 'scenario':
        this.afterScenario.append(...steps);
        break;
      case 'step':
        this.afterStep.append(...steps);
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