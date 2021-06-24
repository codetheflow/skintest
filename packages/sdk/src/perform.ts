import { getCaller, getMeta, Optional } from '@skintest/common';
import { RecipeIterable, RecipeOperator } from './recipe';
import { PerformSchema } from './schema';
import { PerformStep } from './steps/perform';

export function perform<D>(message: string, ...step: PerformSchema<D>): RecipeOperator<Optional<RecipeIterable>, RecipeIterable> {
  const caller = getCaller();
  const getStepMeta = () => getMeta(caller);

  return source => [...(source || []), new PerformStep(getStepMeta, message, step)];
}