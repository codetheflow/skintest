import { TestExecutionResult } from '../sdk/test-result';

export type Attempt = (method: () => Promise<TestExecutionResult>) => Promise<TestExecutionResult>;
