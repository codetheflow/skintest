import { BrowserFactory } from '@skintest/platform';
import * as playwright from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';

const DEFAULT_OPTIONS = {
  headless: true,
  timeout: 30000,
};

type LaunchOptions = Pick<playwright.LaunchOptions, 'timeout' | 'headless'>;

export function playwrightLauncher(options: Partial<LaunchOptions> = {}): BrowserFactory {
  return async function browserFactory() {
    const browserOptions: playwright.LaunchOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    const chromium = playwright['chromium'];
    const browser = await playwrightAction('browser launch', () => chromium.launch(browserOptions));
    return new PlaywrightBrowser(browser, browserOptions.timeout || DEFAULT_OPTIONS.timeout);
  };
}