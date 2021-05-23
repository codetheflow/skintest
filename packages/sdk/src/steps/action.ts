import { Guard } from '@skintest/common';
import { DoStep, StepContext } from '../command';
import { StepMeta } from '../meta';
import { ClientRecipe, ServerRecipe } from '../recipe';
import { pass, TestExecutionResult } from '../test-result';

export class ActionStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    public recipe: ClientRecipe<any> | ServerRecipe<any>,
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    return pass();
  }

  toString(): string {
    return `I'm doing...`;
  }
}