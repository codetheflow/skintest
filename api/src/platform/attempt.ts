import { TestExecutionResult } from '../sdk/test-result';

export type Attempt = (method: () => Promise<void>) => TestExecutionResult;
