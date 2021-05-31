import { Launcher } from '@skintest/platform';
import * as path from 'path';
import * as playwright from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';

const DEFAULT_OPTIONS: playwright.LaunchOptions = {
  headless: true,
  timeout: 30000,
  downloadsPath: path.join(process.cwd(), 'output', 'downloads'),
};

type LaunchOptions = Pick<playwright.LaunchOptions, 'timeout' | 'headless' | 'downloadsPath'>;

export function playwrightLauncher(options: Partial<LaunchOptions> = {}): Launcher {
  async function createBrowser() {
    const browserOptions: playwright.LaunchOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    const chromium = playwright['chromium'];
    const browser = await playwrightAction('browser launch', () => chromium.launch(browserOptions));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new PlaywrightBrowser(browser, browserOptions.timeout!);
  }

  return {
    createBrowser,
    options: {
      retries: 1
    }
  };
}