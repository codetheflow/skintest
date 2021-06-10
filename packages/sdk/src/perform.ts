import { Maybe } from '@skintest/common';
import { getCaller, getStepMeta } from './meta';
import { RecipeIterable, RecipeOperator } from './recipe';
import { PerformSchema } from './schema';
import { PerformStep } from './steps/perform';

export function perform(message: string, ...step: PerformSchema): RecipeOperator<Maybe<RecipeIterable>, RecipeIterable> {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return source => [...(source || []), new PerformStep(getMeta, message, step)];
}