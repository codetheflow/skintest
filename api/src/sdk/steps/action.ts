import { Guard } from '../../common/guard';
import { pass, TestExecutionResult } from '../test-result';
import { ClientRecipe, ServerRecipe } from '../function-support';
import { StepContext, DoStep } from '../command';

export class ActionStep implements DoStep {
  type: 'do' = 'do';

  constructor(
    public recipe: ClientRecipe<any> | ServerRecipe<any>,
    public args: any[]
  ) {
    Guard.notNull(recipe, 'recipe');
    Guard.notNull(args, 'args');
  }

  async execute(context: StepContext): TestExecutionResult {
    return pass();
  }

  toString() {
    return `I do`;
  }
}
