import { errors, extend } from '@skintest/common';
import { Launcher } from '@skintest/platform';
import * as pw from 'playwright';
import { playwrightAction } from './playwright-action';
import { PlaywrightBrowser } from './playwright-browser';
import { PlaywrightMiddleware, PlaywrightUse, playwrightUse } from './playwright-middleware';

const DEFAULT_TIMEOUT = 30 * 1000;
const DEFAULT_LAUNCH_OPTIONS: pw.LaunchOptions = {
  headless: true,
  timeout: DEFAULT_TIMEOUT,
};

const DEFAULT_CONTEXT_OPTIONS: pw.BrowserContextOptions = {
  acceptDownloads: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function playwrightLauncher(use: PlaywrightUse<any>[]): Launcher {
  use = [
    playwrightUse('browser:types', async () => [pw.chromium]),
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
    ...use
  ];

  const middleware = new PlaywrightMiddleware(use);

  return {
    async getBrowsers() {
      const browserTypes = await middleware
        .accept('browser:types', { state: [] });

      if (!browserTypes.length) {
        throw errors.invalidOperation('at least one browser type should be defined');
      }

      return browserTypes.map(browserType => async () => {
        const options = await middleware
          .accept('browser:options', {
            type: pw.chromium,
            state: {}
          });

        const browser = await playwrightAction('browser launch', () => browserType.launch(options));
        return new PlaywrightBrowser(
          browser,
          middleware,
          options.timeout ?? DEFAULT_TIMEOUT
        );
      });
    }
  };
}