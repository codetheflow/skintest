import { getCaller, getStepMeta } from '../meta';
import { RecipeOperator } from '../recipe';
import { StorySchema } from '../schema';
import { PerformStep } from '../steps/perform';

export function perform(message: string, ...plan: StorySchema): RecipeOperator {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return async () => ({
    plan: [new PerformStep(getMeta, message, plan)]
  });
}