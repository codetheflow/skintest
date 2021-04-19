import { Step } from './step';

export type Do = Promise<Step[]>;

export function recipe(title: string, ...steps: Step[]): Do {
  return Promise.resolve(steps);
}
