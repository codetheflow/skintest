import { TestResult } from './test-result';

export type ThatFunction0 = () => Promise<TestResult>;
export type ThatFunction1<A> = (arg1: A) => Promise<TestResult>;
export type ThatFunction2<A, B> = (arg1: A, arg2: B) => Promise<TestResult>;
export type ThatFunction3<A, B, C> = (arg1: A, arg2: B, arg3: C) => Promise<TestResult>;
export type ThatFunction4<A, B, C, D> = (arg1: A, arg2: B, arg3: C, arg4: D) => Promise<TestResult>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThatFunction = (...args: any[]) => Promise<TestResult>;