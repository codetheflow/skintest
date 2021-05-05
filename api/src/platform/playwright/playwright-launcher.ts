import { EMPTY } from '../../common/utils';
import { NodeReportSink } from '../node-reporting';
import { playwrightAttempt } from './playwright-attempt';
import { PlaywrightEngine } from './playwright-engine';
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

  for (let script of suite.getScripts()) {
    const reportSink = new NodeReportSink();
    const reporting = await reportSink.start();

    const browser = await playwright['chromium'].launch(browserOptions);

    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      page.setDefaultTimeout(PAGE_TIMEOUT);

      const engine = new PlaywrightEngine(page);
      const attempt = playwrightAttempt(ATTEMPTS, await reporting.attempt());

      const effect = stage(plugins, {
        engine,
        reporting,
        attempt,
      });

      const init = effect('init', script);
      const destroy = effect('destroy', script)

      try {
        init(EMPTY);
        const scene = new Scene(effect);
        await scene.play(script);
      } finally {
        destroy(EMPTY);
      }
    } finally {
      // todo: add reporting handling ex
      try {
        await browser.close();
      } finally {
        await reportSink.end(reporting);
      }
    }
  }
}
