import { fails, pass, TestResult } from '../test-result';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThatFunction = (this: That, ...args: any[]) => ThatDo;

export type ThatDo = Promise<{ result: TestResult }>;

export interface That {
  fail(message: string): ThatDo;
  pass(): ThatDo;
}

export class AssertThat implements That {
  fail(message: string): ThatDo {
    return Promise.resolve({
      result: fails.that({
        description: message,
        solution: ''
      })
    });
  }

  pass(): ThatDo {
    return Promise.resolve({
      result: pass(),
    });
  }
}

export interface ThatRecipe<T extends ThatFunction> {
  type: 'assert',
  action: T;
}