import { getCaller, getStepMeta } from '../meta';
import { RecipeIterable, RecipeOperator } from '../recipe';
import { ConditionSchema } from '../schema';
import { IIfStep } from '../steps/iif';

export function iif(message: string, ...plan: ConditionSchema): RecipeOperator<RecipeIterable | undefined, RecipeIterable> {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return source => [...(source || []), new IIfStep(getMeta, message, plan)];
}