import { SupportDebug, Walk } from './walk';
import { invalidArgumentError } from '../common/errors';
import { Command, UIStep } from './command';
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

  before(what: 'feature' | 'scenario' | 'step', ...steps: SupportDebug<UIStep>[]): Feature {
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
        throw invalidArgumentError('what', what);
    }

    return this;
  }

  after(what: 'feature' | 'scenario' | 'step', ...steps: SupportDebug<UIStep>[]): Feature {
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

  scenario(name: string, ...steps: Walk): Scenario {
    this.scenarios.push([name, steps]);
    return this;
  }

}