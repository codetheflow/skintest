import { Boxed, Data, getCaller, getMeta, Optional, reinterpret } from '@skintest/common';
import { RecipeIterable, RecipeOperator } from './recipe';
import { EvalStep } from './steps/eval';

export function serialize<V extends Data>(serializable: V): Boxed<V> {
  return { value: serializable };
}

export function evaluate<V extends Data>(message: string, arg: Boxed<V>, pageFunction: (arg: V) => void): RecipeOperator<Optional<RecipeIterable>, RecipeIterable> {
  const caller = getCaller();
  const getStepMeta = () => getMeta(caller);

  return source => [...(source || []),
  new EvalStep(
    getStepMeta,
    message,
    reinterpret<(arg: Data) => void>(pageFunction),
    arg.value
  )];
}