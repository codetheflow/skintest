import * as playwright from 'playwright';
import { EMPTY } from '../../common/utils';
import { Suite } from '../../sdk/suite';
import { NodeReportSink } from '../node-reporting';
import { Plugin, stage } from '../plugin';
import { Scene } from '../scene';
import { playwrightAttempt } from './playwright-attempt';
import { PlaywrightBrowser } from './playwright-browser';

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
        const scene = new Scene(effect, new PlaywrightBrowser(context, PAGE_TIMEOUT));
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
