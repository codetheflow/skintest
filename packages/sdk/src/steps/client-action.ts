import { Guard } from '@skintest/common';
import { DoStep, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { ClientFunction, ClientPage, ClientRecipe } from '../recipes/client';
import { pass } from '../test-result';

export class ClientActionStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public recipe: ClientRecipe<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(context: StepContext): StepExecutionResult {
    const { browser } = context;
    const page = browser.getCurrentPage();
    const clientPage = new ClientPage(page);
    const action = this.recipe.action as ClientFunction;
    const { plan } = await action.apply({ page: clientPage }, this.args);

    return {
      result: pass(),
      plans: [plan],
    };
  }

  toString(): string {
    return `I'm doing...`;
  }
}