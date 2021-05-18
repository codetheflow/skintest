import { Guard } from '../../common/guard';
import { DoStep, StepContext } from '../command';
import { ClientRecipe, ServerRecipe } from '../recipe';
import { Meta } from '../reflect';
import { pass, TestExecutionResult } from '../test-result';

export class ActionStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public meta: Promise<Meta>,
    public recipe: ClientRecipe<any> | ServerRecipe<any>,
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    return pass();
  }

  toString() {
    return `I'm doing...`;
  }
}
