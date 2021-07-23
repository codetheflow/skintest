import { errors, extend } from '@skintest/common';
import { Launcher } from '@skintest/platform';
import * as pw from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';
import { PlaywrightMiddleware, PlaywrightUse, playwrightUse } from './playwright-middleware';

const DEFAULT_OPTIONS = {
  headless: true,
  timeout: 30000,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function playwrightLauncher(...use: PlaywrightUse<any>[]): Launcher {
  use = [
    playwrightUse('browser:types', async () => [pw.chromium]),
    playwrightUse('browser:options', async ({ options }) => {
      return extend(options, { timeout: DEFAULT_OPTIONS.timeout });
    }),
    playwrightUse('context:options', async ({ options }) => {
      return extend(options, { acceptDownloads: true });
    }),
    playwrightUse('page:new', async ({ page }) => {
      page.setDefaultTimeout(DEFAULT_OPTIONS.timeout);
      page.setDefaultNavigationTimeout(DEFAULT_OPTIONS.timeout);
    }),
    ...use
  ];

  const middleware = new PlaywrightMiddleware(use);

  return {
    async getBrowsers() {
      const browserTypes = await middleware
        .accept('browser:types', { types: [] });

      if (!browserTypes.length) {
        throw errors.invalidOperation('at least one browser type should be defined');
      }

      return browserTypes.map(browserType => async () => {
        const options = await middleware
          .accept('browser:options', {
            type: pw.chromium,
            options: {}
          });

        const browser = await playwrightAction('browser launch', () => browserType.launch(options));
        return new PlaywrightBrowser(
          browser,
          middleware,
          options.timeout ?? DEFAULT_OPTIONS.timeout
        );
      });
    }
  };
}