import { getCaller, getStepMeta } from '../meta';
import { RecipeIterable, RecipeOperator } from '../recipe';
import { ConditionSchema } from '../schema';
import { RepeatStep } from '../steps/repeat';

export function repeat(message: string, ...path: ConditionSchema): RecipeOperator<RecipeIterable | undefined, RecipeIterable> {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return source => [...(source || []), new RepeatStep(getMeta, message, path)];
}