import { Command } from './command';

export type TaskIterable = Iterable<Command>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Task = TaskOperator<any, TaskIterable>;

export type TaskFunction0 = () => Promise<Task>;
export type TaskFunction1<A> = (arg1: A) => Promise<Task>;
export type TaskFunction2<A, B> = (arg1: A, arg2: B) => Promise<Task>;
export type TaskFunction3<A, B, C> = (arg1: A, arg2: B, arg3: C) => Promise<Task>;
export type TaskFunction4<A, B, C, D> = (arg1: A, arg2: B, arg3: C, arg4: D) => Promise<Task>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TaskFunction = (...args: any[]) => Promise<Task>;

export type TaskOperator<In, Out> = (source: In) => Out;

export function task(): TaskOperator<void, TaskIterable>;
export function task<T, A = TaskIterable>(
  op1: TaskOperator<T, A>
): TaskOperator<T, A>;
export function task<T, A, B = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>
): TaskOperator<T, B>;
export function task<T, A, B, C = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>
): TaskOperator<T, C>;
export function task<T, A, B, C, D = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>
): TaskOperator<T, D>;
export function task<T, A, B, C, D, E = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>
): TaskOperator<T, E>;
export function task<T, A, B, C, D, E, F = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>
): TaskOperator<T, F>;
export function task<T, A, B, C, D, E, F, G = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>
): TaskOperator<T, G>;
export function task<T, A, B, C, D, E, F, G, H = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>,
  op8: TaskOperator<G, H>
): TaskOperator<T, H>;
export function task<T, A, B, C, D, E, F, G, H, I = TaskIterable>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>,
  op8: TaskOperator<G, H>,
  op9: TaskOperator<H, I>
): TaskOperator<T, I>;
export function task<T, A, B, C, D, E, F, G, H, I>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>,
  op8: TaskOperator<G, H>,
  op9: TaskOperator<H, I>,
): TaskOperator<T, TaskIterable>;
export function task<T, A, B, C, D, E, F, G, H, I, J>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>,
  op8: TaskOperator<G, H>,
  op9: TaskOperator<H, I>,
  op10: TaskOperator<I, J>,
): TaskOperator<T, TaskIterable>;
export function task<T, A, B, C, D, E, F, G, H, I, J, K>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>,
  op8: TaskOperator<G, H>,
  op9: TaskOperator<H, I>,
  op10: TaskOperator<I, J>,
  op11: TaskOperator<J, K>,
): TaskOperator<T, TaskIterable>;
export function task<T, A, B, C, D, E, F, G, H, I, J, K, L>(
  op1: TaskOperator<T, A>,
  op2: TaskOperator<A, B>,
  op3: TaskOperator<B, C>,
  op4: TaskOperator<C, D>,
  op5: TaskOperator<D, E>,
  op6: TaskOperator<E, F>,
  op7: TaskOperator<F, G>,
  op8: TaskOperator<G, H>,
  op9: TaskOperator<H, I>,
  op10: TaskOperator<I, J>,
  op11: TaskOperator<J, K>,
  op12: TaskOperator<K, L>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...ops: TaskOperator<any, any>[]
): TaskOperator<T, TaskIterable>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function task(...ops: Array<TaskOperator<any, any>>): Task {
  if (ops.length === 0) {
    return () => [];
  }

  if (ops.length === 1) {
    return ops[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function piped(input: any): TaskIterable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ops.reduce((prev: any, op: TaskOperator<any, any>) => op(prev), input);
  };
}