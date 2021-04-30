import { TestExecutionResult } from './test-result';

export type Attempt = (method: () => Promise<void>) => TestExecutionResult;
