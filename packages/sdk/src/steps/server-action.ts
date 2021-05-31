import { Guard } from '@skintest/common';
import { asTest, DoStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { Process, ServerFunction, ServerRecipe } from '../recipes/server';

export class ServerActionStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public recipe: ServerRecipe<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(): StepExecutionResult {
    const server = new Process();
    const action = this.recipe.action as ServerFunction;
    await action.apply(server, this.args);

    return asTest(Promise.resolve());
  }

  toString(): string {
    return `I'm doing...`;
  }
}