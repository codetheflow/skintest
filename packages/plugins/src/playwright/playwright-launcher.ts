import { Launcher, LaunchOptions } from '@skintest/platform';
import * as playwright from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';

const DEFAULT_OPTIONS: LaunchOptions = {
  headless: true,
  timeout: 30000,
};

export function playwrightLauncher(options: Partial<LaunchOptions> = {}): Launcher {
  const launchOptions: LaunchOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  async function createBrowser() {
    const chromium = playwright['chromium'];
    const browser = await playwrightAction('browser launch', () => chromium.launch(launchOptions));

    return new PlaywrightBrowser(browser, launchOptions.timeout);
  }

  return {
    createBrowser,
    options: launchOptions
  };
}