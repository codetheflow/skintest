import { Feature, Scenario } from './feature';
import { Step } from './step';
import { invalidArgumentError } from '../common/errors';

export class Script implements Feature, Scenario {
  beforeFeature: Step[] = [];
  afterFeature: Step[] = []

  beforeScenario: Step[] = [];
  afterScenario: Step[] = [];

  beforeStep: Step[] = [];
  afterStep: Step[] = [];

  scenarios: Array<[string, Step[]]> = [];

  constructor(public readonly name: string) {
  }

  before(what: 'feature' | 'scenario' | 'step', ...steps: Step[]): Feature {
    switch (what) {
      case 'feature':
        this.beforeFeature.push(...steps);
        break;
      case 'scenario':
        this.beforeScenario.push(...steps);
      case 'step':
        this.beforeStep.push(...steps);
        break;
      default:
        throw invalidArgumentError('what', what);
    }

    return this;
  }

  after(what: 'feature' | 'scenario' | 'step', ...steps: Step[]): Feature {
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
        throw invalidArgumentError('what', what);
    }

    return this;
  }

  scenario(name: string, ...steps: Step[]): Feature {
    this.scenarios.push([name, steps]);

    return this;
  }
}