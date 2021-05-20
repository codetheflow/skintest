import { BrowserFactory } from './browser-factory';
import { Plugin } from './plugin';

export interface Project {
  run(createBrowser: BrowserFactory, ...plugins: Plugin[]): Promise<void>;
}