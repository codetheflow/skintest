export interface TestFail {
  code: string;
  description: string;
  solution: string;
}

export type TestExecutionResult = Promise<TestFail | null>;