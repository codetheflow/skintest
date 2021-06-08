import { getCaller, getStepMeta } from '../meta';
import { RecipeIterable, RecipeOperator } from '../recipe';
import { StorySchema } from '../schema';
import { PerformStep } from '../steps/perform';

export function perform(message: string, ...plan: StorySchema): RecipeOperator<RecipeIterable | undefined, RecipeIterable> {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return source => [...(source || []), new PerformStep(getMeta, message, plan)];
}