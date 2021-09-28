import { getCaller, getMeta, isFunction } from '@skintest/common';
import { AssertStep } from '../command';
import { SeeStep } from '../steps/see-step';
import { ThatStep } from '../steps/that-step';
import { ThatFunction0, ThatFunction1, ThatFunction2, ThatFunction3, ThatFunction4 } from '../that';
import { Value } from '../value';
import { Assert } from '../verify/assert';

export class CanSee {
  // todo: make binary assert type better
  see<T, D, V>(target: T, has: Assert<T, Value<V, D>>, value: Value<V, D>): AssertStep<D>;
  see<D>(that: ThatFunction0): AssertStep<D>;
  see<D, T1>(that: ThatFunction1<T1>, arg1: Value<T1, D>): AssertStep<D>;
  see<D, T1, T2>(that: ThatFunction2<T1, T2>, arg1: Value<T1, D>, arg2: Value<T2, D>): AssertStep<D>;
  see<D, T1, T2, T3>(that: ThatFunction3<T1, T2, T3>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>): AssertStep<D>;
  see<D, T1, T2, T3, T4>(that: ThatFunction4<T1, T2, T3, T4>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>, arg4: Value<T4, D>): AssertStep<D>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  see<D>(op: any, ...args: any[]): AssertStep<D> {
    const caller = getCaller();
    if (isFunction(op)) {
      return new ThatStep(() => getMeta(caller), op, args);
    }

    return new SeeStep(() => getMeta(caller), op, args[0], args[1]);
  }
}