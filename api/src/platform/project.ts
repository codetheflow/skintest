import { Plugin } from './plugin';

export interface Project {
  run(
    ...plugins: Plugin[]
  ): Promise<void>;
}
