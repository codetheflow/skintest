import { StorySchema, ScenarioSchema, StoryStep } from './schema';
import { invalidArgumentError } from '../common/errors';
import { Command } from './command';
import { Feature, Scenario } from './feature';

export class Script implements Feature, Scenario {
  beforeFeature: Command[] = [];
  afterFeature: Command[] = []

  beforeScenario: Command[] = [];
  afterScenario: Command[] = [];

  beforeStep: Command[] = [];
  afterStep: Command[] = [];

  scenarios: Array<[string, Command[]]> = [];

  constructor(public readonly name: string) {
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
        throw invalidArgumentError('what', what);
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
        throw invalidArgumentError('what', what);
    }

    return this;
  }

  scenario(name: string, ...schema: ScenarioSchema): Scenario {
    this.scenarios.push([name, schema]);
    return this;
  }
}