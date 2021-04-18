import { Feature, Scenario } from './feature';
import { Step } from '../command/step';

export class Fixture implements Feature, Scenario {
  beforeFeature: Step[] = [];
  afterFeature: Step[] = []

  beforeScenario: Step[] = [];
  afterScenario: Step[] = [];

  scenarios: Array<[string, Step[]]> = [];

  constructor(public name: string) {
  }

  before(what: 'feature' | 'scenario', ...steps: Step[]): Feature {
    switch (what) {
      case 'feature':
        this.beforeFeature.push(...steps);
        break;
      case 'scenario':
        this.beforeScenario.push(...steps);
      default:
        throw new Error(`Invalid argument what ${what}`);
    }

    return this;
  }

  after(what: 'feature' | 'scenario', ...steps: Step[]): Feature {
    switch (what) {
      case 'feature':
        this.afterFeature.push(...steps);
        break;
      case 'scenario':
        this.afterScenario.push(...steps);
      default:
        throw new Error(`Invalid argument what ${what}`);
    }

    return this;
  }

  scenario(name: string, ...steps: Step[]): Feature {
    this.scenarios.push([name, steps]);

    return this;
  }
}