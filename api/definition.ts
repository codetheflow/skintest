import { MyStep } from './my-step';

export interface Definition {
  xxx: any; // TODO: define interface
}

export type MyDefinition = Promise<Definition>;

export function def(title: string, ...steps: MyStep[]): MyDefinition {
  throw new Error('not implemented');
}

