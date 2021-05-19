import { Plugin } from '@skintest/sdk';
import { BrowserFactory } from './browser-factory';

export interface Project {
  run(createBrowser: BrowserFactory, ...plugins: Plugin[]): Promise<void>;
}
