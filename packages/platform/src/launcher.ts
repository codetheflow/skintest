import { Browser } from '@skintest/sdk';

export type BrowserFactory = () => Promise<Browser>;

export type LauncherOptions = {
  retries: number;
};

export interface Launcher {
  createBrowser: BrowserFactory;
  options: LauncherOptions;
}