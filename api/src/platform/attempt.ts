import { TestExecutionResult } from '../sdk/test-result';

export type Attempt = (method: () => TestExecutionResult) => TestExecutionResult;
