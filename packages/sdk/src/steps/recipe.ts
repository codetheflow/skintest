import { Guard, Meta } from '@skintest/common';
import { DoStep, StepExecutionResult } from '../command';
import { RecipeFunction } from '../recipe';

export class RecipeStep<D> implements DoStep<D> {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<Meta>,
    public recipe: RecipeFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(): Promise<StepExecutionResult> {
    const op = await this.recipe(...this.args);
    const plan = op(undefined);

    return {
      type: 'recipe',
      plan: Array.from(plan),
    };
  }

  toString(): string {
    return 'recipe';
  }
}