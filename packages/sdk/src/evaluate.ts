import { Boxed, Maybe, reinterpret, Serializable } from '@skintest/common';
import { getCaller, getStepMeta } from './meta';
import { RecipeIterable, RecipeOperator } from './recipe';
import { EvalStep } from './steps/eval';

export function serialize<V extends Serializable>(value: V): Boxed<V> {
  return { value };
}

export function evaluate<A extends Serializable>(message: string, arg: Boxed<A>, pageFunction: (arg: A) => void): RecipeOperator<Maybe<RecipeIterable>, RecipeIterable> {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return source => [...(source || []),
  new EvalStep(
    getMeta,
    message,
    reinterpret<(arg: Serializable) => void>(pageFunction),
    arg.value
  )];
}