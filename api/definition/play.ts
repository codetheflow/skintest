import { Step } from '../command/step';

export type Do = Promise<Step[]>;

export function play(title: string, ...steps: Step[]): Do {
  return Promise.resolve(steps);
}
