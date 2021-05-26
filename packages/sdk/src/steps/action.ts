import { Guard } from '@skintest/common';
import { DoStep } from '../command';
import { StepMeta } from '../meta';
import { ClientRecipe, ServerRecipe } from '../recipe';
import { pass, TestExecutionResult } from '../test-result';

export class ActionStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public recipe: ClientRecipe<any> | ServerRecipe<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(): Promise<TestExecutionResult> {
    return pass();
  }

  toString(): string {
    return `I'm doing...`;
  }
}