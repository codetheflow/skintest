import { Command } from './command';

export type RecipeIterable = Iterable<Command>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Recipe = RecipeOperator<any, RecipeIterable>;

export type RecipeFunction0 = () => Promise<Recipe>;
export type RecipeFunction1<A> = (arg1: A) => Promise<Recipe>;
export type RecipeFunction2<A, B> = (arg1: A, arg2: B) => Promise<Recipe>;
export type RecipeFunction3<A, B, C> = (arg1: A, arg2: B, arg3: C) => Promise<Recipe>;
export type RecipeFunction4<A, B, C, D> = (arg1: A, arg2: B, arg3: C, arg4: D) => Promise<Recipe>;

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
): RecipeOperator<T, RecipeIterable>;
export function recipe<T, A, B, C, D, E, F, G, H, I, J>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>,
  op8: RecipeOperator<G, H>,
  op9: RecipeOperator<H, I>,
  op10: RecipeOperator<I, J>,
): RecipeOperator<T, RecipeIterable>;
export function recipe<T, A, B, C, D, E, F, G, H, I, J, K>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>,
  op8: RecipeOperator<G, H>,
  op9: RecipeOperator<H, I>,
  op10: RecipeOperator<I, J>,
  op11: RecipeOperator<J, K>,
): RecipeOperator<T, RecipeIterable>;
export function recipe<T, A, B, C, D, E, F, G, H, I, J, K, L>(
  op1: RecipeOperator<T, A>,
  op2: RecipeOperator<A, B>,
  op3: RecipeOperator<B, C>,
  op4: RecipeOperator<C, D>,
  op5: RecipeOperator<D, E>,
  op6: RecipeOperator<E, F>,
  op7: RecipeOperator<F, G>,
  op8: RecipeOperator<G, H>,
  op9: RecipeOperator<H, I>,
  op10: RecipeOperator<I, J>,
  op11: RecipeOperator<J, K>,
  op12: RecipeOperator<K, L>,
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