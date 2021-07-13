import { errors } from '@skintest/common';
import { Launcher } from '@skintest/platform';
import * as pw from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';
import { PlaywrightMiddleware, playwrightMiddleware, PlaywrightMiddlewareUse } from './playwright-middleware';

const DEFAULT_OPTIONS = {
  headless: true,
  timeout: 30000,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function playwrightLauncher(...use: PlaywrightMiddlewareUse<any>[]): Launcher {
  use = [
    playwrightMiddleware('browser:new', async ({ options }) => {
      return {
        ...options, ...{
          timeout: DEFAULT_OPTIONS.timeout
        }
      };
    }),
    playwrightMiddleware('context:new', async ({ options }) => {
      return {
        ...options, ... {
          acceptDownloads: true,
        }
      };
    }),
    playwrightMiddleware('page:new', async ({ page }) => {
      page.setDefaultTimeout(DEFAULT_OPTIONS.timeout);
      page.setDefaultNavigationTimeout(DEFAULT_OPTIONS.timeout);
    }),
    ...use
  ];

  const middleware = new PlaywrightMiddleware(use);

  return {
    async getBrowsers() {
      const browserTypes = await middleware
        .accept('browser:type', { types: [pw.chromium] });

      if (!browserTypes.length) {
        throw errors.constraint('at least one browser type should be defined');
      }

      return browserTypes.map(browserType => async () => {
        const options = await middleware
          .accept('browser:new', {
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