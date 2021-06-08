import { TestResult } from './test-result';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThatFunction = (...args: any[]) => Promise<TestResult>;