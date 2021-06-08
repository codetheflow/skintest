import { getCaller, getStepMeta } from '../meta';
import { RecipeOperator } from '../recipe';
import { ConditionSchema } from '../schema';
import { RepeatStep } from '../steps/repeat';

export function repeat(message: string, ...path: ConditionSchema): RecipeOperator {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return async () => ({
    plan: [new RepeatStep(getMeta, path)]
  });
}