import { Command } from './command';

export type RecipeIterable = Iterable<Command>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Recipe = RecipeOperator<any, RecipeIterable>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecipeFunction = (...args: any[]) => Promise<Recipe>;

export type RecipeOperator<In, Out> = (source: In) => Out;

export function recipe(): RecipeOperator<void, RecipeIterable>;
export function recipe<T, A = RecipeIterable>(
  op1: RecipeOperator<T, A>
): RecipeOperator<T, A>;
export function recipe<T, A, B = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>
): RecipeOperator<T, B>;
export function recipe<T, A, B, C = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>
): RecipeOperator<T, C>;
export function recipe<T, A, B, C, D = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>
): RecipeOperator<T, D>;
export function recipe<T, A, B, C, D, E = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>
): RecipeOperator<T, E>;
export function recipe<T, A, B, C, D, E, F = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>
): RecipeOperator<T, F>;
export function recipe<T, A, B, C, D, E, F, G = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>
): RecipeOperator<T, G>;
export function recipe<T, A, B, C, D, E, F, G, H = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>,
  op8: RecipeOperator<G, H>
): RecipeOperator<T, H>;
export function recipe<T, A, B, C, D, E, F, G, H, I = RecipeIterable>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>,
  op8: RecipeOperator<G, H>,
  op9: RecipeOperator<H, I>
): RecipeOperator<T, I>;
export function recipe<T, A, B, C, D, E, F, G, H, I>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>,
  op8: RecipeOperator<G, H>,
  op9: RecipeOperator<H, I>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...ops: RecipeOperator<any, any>[]
): RecipeOperator<T, RecipeIterable>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recipe(...ops: Array<RecipeOperator<any, any>>): Recipe {
  if (ops.length === 0) {
    return () => [];
  }

  if (ops.length === 1) {
    return ops[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function piped(input: any): RecipeIterable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ops.reduce((prev: any, op: RecipeOperator<any, any>) => op(prev), input);
  };
}