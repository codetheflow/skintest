import { UIStep } from './command';

export type Do = Promise<UIStep[]>;

export function recipe(title: string, ...steps: UIStep[]): Do {
  return Promise.resolve(steps);
}
