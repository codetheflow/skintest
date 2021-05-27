import { Launcher } from './launcher';

export interface Project {
  run(launcher: Launcher): Promise<void>;
}