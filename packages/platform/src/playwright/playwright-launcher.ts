import * as playwright from 'playwright';
import { BrowserFactory } from '../browser-factory';
import { PlaywrightBrowser } from './playwright-browser';

const DEFAULT_OPTIONS = {
  headless: true,
  timeout: 30000,
};

type LaunchOptions = Pick<playwright.LaunchOptions, 'timeout' | 'headless'>;

export function playwrightLauncher(options: LaunchOptions = {}): BrowserFactory {
  return async function browserFactory() {
    const browserOptions: playwright.LaunchOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    const browser = await playwright['chromium'].launch(browserOptions);
    return new PlaywrightBrowser(browser, browserOptions.timeout || DEFAULT_OPTIONS.timeout);
  }
}