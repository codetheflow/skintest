import { getCaller, getMeta } from '@skintest/common';
import { DoStep } from '../command';
import { TaskStep } from '../steps/task-step';
import { TaskFunction, TaskFunction0, TaskFunction1, TaskFunction2, TaskFunction3, TaskFunction4 } from '../task';
import { Value } from '../value';

export class CanDo {
  do<D>(task: TaskFunction0): DoStep<D>;
  do<D, T1>(task: TaskFunction1<T1>, arg1: Value<T1, D>): DoStep<D>;
  do<D, T1, T2>(task: TaskFunction2<T1, T2>, arg1: Value<T1, D>, arg2: Value<T2, D>): DoStep<D>;
  do<D, T1, T2, T3>(task: TaskFunction3<T1, T2, T3>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>): DoStep<D>;
  do<D, T1, T2, T3, T4>(task: TaskFunction4<T1, T2, T3, T4>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>, arg4: Value<T4, D>): DoStep<D>;
  do<D, F extends TaskFunction>(task: F, ...args: Parameters<F>): DoStep<D> {
    const caller = getCaller();
    return new TaskStep(() => getMeta(caller), task, args);
  }
}