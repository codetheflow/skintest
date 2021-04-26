import { Suite } from '../integration/suite';
import { playwrightLauncher } from './playwright-launcher';
import * as glob from 'glob';
import * as path from 'path';

export interface Project {
  addFeaturesFrom(path: string): Promise<void>;
  run(): Promise<void>;
}
