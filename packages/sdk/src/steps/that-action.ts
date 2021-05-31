import { Guard } from '@skintest/common';
import { AssertStep, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { AssertThat, ThatFunction, ThatRecipe } from '../recipes/that';

export class ThatActionStep implements AssertStep {
  type: 'assert' = 'assert';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public recipe: ThatRecipe<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(): StepExecutionResult {
    const that = new AssertThat();
    const action = this.recipe.action as ThatFunction;
    const { result } = await action.apply(that, this.args);
    return {
      result,
      plans: [],
    };
  }

  toString(): string {
    return `I see that...`;
  }
}