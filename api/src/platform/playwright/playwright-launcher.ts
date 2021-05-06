import { EMPTY } from '../../common/utils';
import { NodeReportSink } from '../node-reporting';
import { playwrightAttempt } from './playwright-attempt';
import { PlaywrightPageDriver } from './playwright-page-driver';
import { Plugin, stage } from '../plugin';
import { Scene } from '../scene';
import { Suite } from '../../sdk/suite';
import * as playwright from 'playwright';

export async function playwrightLauncher(suite: Suite, plugins: Plugin[]) {
  const BROWSER_START_TIMEOUT = 30000;
  const PAGE_TIMEOUT = 30000;
  const ATTEMPTS = 1;

  const browserOptions: playwright.LaunchOptions = {
    headless: true,
    timeout: BROWSER_START_TIMEOUT,
  };

  const reportSink = new NodeReportSink();
  const reporting = await reportSink.start();
  const attempt = playwrightAttempt(ATTEMPTS, await reporting.attempt());
  const effect = stage(plugins, {
    reporting,
    attempt,
  });

  const init = effect('init');
  const destroy = effect('destroy');

  try {
    init(EMPTY);
    for (let script of suite.getScripts()) {
      const browser = await playwright['chromium'].launch(browserOptions);

      try {
        const context = await browser.newContext();
        const page = await context.newPage();
        page.setDefaultTimeout(PAGE_TIMEOUT);

        const pageDriver = new PlaywrightPageDriver(page);
        const scene = new Scene(effect, pageDriver);
        await scene.play(script);
      } finally {
        // todo: add reporting handling ex
        await browser.close();
      }
    }
  } finally {
    // todo: add reporting handling ex
    try {
      destroy(EMPTY);
    } finally {
      await reportSink.end(reporting);
    }
  }
}
