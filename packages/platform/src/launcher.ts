import { Browser } from '@skintest/sdk';

export type BrowserFactory = () => Promise<Browser>;

export type LaunchOptions = {
  headless: boolean,
  timeout: number
};

export interface Launcher {
  createBrowser: BrowserFactory;
  options: LaunchOptions;
}