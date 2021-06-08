import { getCaller, getStepMeta } from '../meta';
import { RecipeOperator } from '../recipe';
import { ConditionSchema } from '../schema';
import { IIfStep } from '../steps/iif';

export function iif(message: string, ...plan: ConditionSchema): RecipeOperator {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return async () => ({
    plan: [new IIfStep(getMeta, message, plan)]
  });
}