import { Guard } from '@skintest/common';
import { DoStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { RecipeFunction } from '../recipe';

export class RecipeStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    public recipe: RecipeFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(): Promise<StepExecutionResult> {
    const recipe = await this.recipe(...this.args);

    return {
      type: 'recipe',
      plan: recipe.plan,
    };
  }

  toString(): string {
    return `I do...`;
  }
}