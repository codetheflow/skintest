import { extend, Guard } from '@skintest/common';
import { Browser } from '@skintest/web';
import * as pw from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';
import { PlaywrightMiddleware, playwrightUse, PlaywrightUse } from './playwright-middleware';

const DEFAULT_TIMEOUT = 30 * 1000;
const DEFAULT_LAUNCH_OPTIONS: pw.LaunchOptions = {
  headless: true,
  timeout: DEFAULT_TIMEOUT,
};

const DEFAULT_CONTEXT_OPTIONS: pw.BrowserContextOptions = {
  acceptDownloads: true,
};


export function playwrightBrowserBuilder(): PlaywrightBrowserBuilder {
  return new PlaywrightBrowserBuilder();
}

class PlaywrightBrowserBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private useList: PlaywrightUse<any>[] = [];

  type(type: pw.BrowserType): PlaywrightBrowserBuilder {
    Guard.notNull(type, 'type');

    this.useList.push(
      playwrightUse('browser:type', async () => type)
    );

    return this;
  }

  options(options: pw.LaunchOptions): PlaywrightBrowserBuilder {
    Guard.notNull(options, 'options');

    this.useList.push(
      playwrightUse('browser:options', async ({ state }) => {
        return extend(state, options);
      })
    );

    return this;
  }

  timeout(ms: number): PlaywrightBrowserBuilder {
    this.useList.push(
      playwrightUse('browser:options', async ({ state }) => {
        return extend(state, { timeout: ms });
      })
    );

    this.useList.push(
      playwrightUse('page:new', async ({ state: page }) => {
        page.setDefaultTimeout(ms);
        page.waitForTimeout(ms);
        page.setDefaultNavigationTimeout(ms);
        return page;
      })
    );

    return this;
  }

  contextOptions(options: pw.BrowserContextOptions): PlaywrightBrowserBuilder {
    Guard.notNull(options, 'options');

    this.useList.push(
      playwrightUse('context:options', async () => options)
    );

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware(...use: PlaywrightUse<any>[]): PlaywrightBrowserBuilder {
    Guard.notNull(use, 'use');

    this.useList.push(...use);

    return this;
  }

  async build(): Promise<Browser> {
    const use = [
      playwrightUse('browser:type', async () => pw.chromium),
      playwrightUse('browser:options', async ({ state: options }) => {
        return extend(options, DEFAULT_LAUNCH_OPTIONS);
      }),
      playwrightUse('context:options', async ({ state: options }) => {
        return extend(options, DEFAULT_CONTEXT_OPTIONS);
      }),
      playwrightUse('page:new', async ({ state }) => {
        state.setDefaultTimeout(DEFAULT_TIMEOUT);
        state.setDefaultNavigationTimeout(DEFAULT_TIMEOUT);
        state.waitForTimeout(DEFAULT_TIMEOUT);
        return state;
      }),
      ...this.useList
    ];

    const middleware = new PlaywrightMiddleware(use);

    const options = await middleware
      .accept('browser:options', {
        state: {}
      });

    const browserType = await middleware
      .accept('browser:type', { state: pw.chromium });

    const browser = await playwrightAction('browser launch', () => browserType.launch(options));
    return new PlaywrightBrowser(browser, middleware);
  }
}