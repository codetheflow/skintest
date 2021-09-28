// import { getCaller, getMeta, isFunction } from '@skintest/common';
// import { ClientStep } from '../command';
// import { Query, QueryList } from '../query';
// import { SeeStep } from '../steps/see-step';
// import { ThatStep } from '../steps/that-step';
// import { WaitStep } from '../steps/wait-step';
// import { ThatFunction0, ThatFunction1, ThatFunction2, ThatFunction3, ThatFunction4 } from '../that';
// import { Value } from '../value';
// import { Assert, ListAssert } from '../verify/assert';

// export class CanWait {
//   wait<D, E, V>(target: Query<E>, has: Assert<V>, value: Value<V, D>): ClientStep<D>;
//   wait<D, E, V>(targets: QueryList<E>, has: ListAssert<V>, value: Value<V, D>): ClientStep<D>;
//   wait<D>(that: ThatFunction0): ClientStep<D>;
//   wait<D, T1>(that: ThatFunction1<T1>, arg1: Value<T1, D>): ClientStep<D>;
//   wait<D, T1, T2>(that: ThatFunction2<T1, T2>, arg1: Value<T1, D>, arg2: Value<T2, D>): ClientStep<D>;
//   wait<D, T1, T2, T3>(that: ThatFunction3<T1, T2, T3>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>): ClientStep<D>;
//   wait<D, T1, T2, T3, T4>(that: ThatFunction4<T1, T2, T3, T4>, arg1: Value<T1, D>, arg2: Value<T2, D>, arg3: Value<T3, D>, arg4: Value<T4, D>): ClientStep<D>;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   wait<D>(targetOrTask: any, ...args: any[]): ClientStep<D> {
//     const caller = getCaller();
//     const assert = isFunction(targetOrTask)
//       ? new ThatStep(() => getMeta(caller), targetOrTask, args)
//       : new SeeStep(() => getMeta(caller), this.verify, targetOrTask, args[0], args[1]);

//     return new WaitStep(() => getMeta(caller), assert);
//   }
// }