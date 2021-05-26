import { Launcher } from './launcher';
import { Plugin } from './plugin';

export interface Project {
  run(launcher: Launcher, ...plugins: Plugin[]): Promise<void>;
}