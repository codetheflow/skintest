import { extend, Guard } from '@skintest/common';
import { Launcher } from '@skintest/platform';
import * as pw from 'playwright';
import { playwrightLauncher } from './playwright-launcher';
import { playwrightUse, PlaywrightUse } from './playwright-middleware';

export function playwrightLauncherBuilder(): PlaywrightLauncherBuilder {
  return new PlaywrightLauncherBuilder();
}

class PlaywrightLauncherBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private useList: PlaywrightUse<any>[] = [];

  browserTypes(...types: pw.BrowserType[]): PlaywrightLauncherBuilder {
    Guard.notNull(types, 'types');

    this.useList.push(
      playwrightUse('browser:types', async () => types)
    );

    return this;
  }

  browserOptions(options: pw.LaunchOptions): PlaywrightLauncherBuilder {
    Guard.notNull(options, 'options');

    this.useList.push(
      playwrightUse('browser:options', async ({ state }) => {
        return extend(state, options);
      })
    );

    return this;
  }

  timeout(ms: number): PlaywrightLauncherBuilder {
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

  contextOptions(options: pw.BrowserContextOptions): PlaywrightLauncherBuilder {
    Guard.notNull(options, 'options');

    this.useList.push(
      playwrightUse('context:options', async () => options)
    );

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware(...use: PlaywrightUse<any>[]): PlaywrightLauncherBuilder {
    Guard.notNull(use, 'use');

    this.useList.push(...use);

    return this;
  }

  build(): Launcher {
    return playwrightLauncher(this.useList);
  }
}