import * as playwright from 'playwright';
import { BrowserFactory } from '../browser-factory';
import { PlaywrightBrowser } from './playwright-browser';

const DEFAULT_OPTIONS: playwright.LaunchOptions = {
  headless: true,
  timeout: 30000,
};

export function playwrightLauncher(/*options: playwright.LaunchOptions = {}*/): BrowserFactory {
  return async function browserFactory() {
    const browserOptions: playwright.LaunchOptions = {
      ...DEFAULT_OPTIONS,
     // ...options
    };

    const browser = await playwright['chromium'].launch(browserOptions);
    return new PlaywrightBrowser(browser, browserOptions.timeout || 3000);
  }
}