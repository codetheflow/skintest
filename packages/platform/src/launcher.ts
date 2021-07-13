import { Browser } from '@skintest/sdk';

export type BrowserFactory = () => Promise<Browser>;

export interface Launcher {
  getBrowsers(): Promise<BrowserFactory[]>;
}