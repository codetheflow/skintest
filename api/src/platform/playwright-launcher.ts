import { NodeReport } from './node-report';
import { PlaywrightEngine } from './playwright-engine';
import { Scene } from './scene';
import { Suite } from '../sdk/suite';
import { playwrightAttempt } from './playwright-attempt';
import * as playwright from 'playwright';

export async function playwrightLauncher(suite: Suite) {
  const BROWSER_START_TIMEOUT = 5000;
  const PAGE_TIMEOUT = 5000;
  const ATTEMPTS = 1;

  const browserOptions: playwright.LaunchOptions = {
    headless: true,
    timeout: BROWSER_START_TIMEOUT,
  };

  for (let script of suite.getScripts()) {
    const browser = await playwright['chromium'].launch(browserOptions);
    const context = await browser.newContext();

    const page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT);

    const engine = new PlaywrightEngine(page);
    const report = new NodeReport();
    const attempt = playwrightAttempt(ATTEMPTS, report.attempt());
    const scene = new Scene(engine, report, attempt);

    try {
      await scene.play(script);
    } finally {
      await browser.close();
    }
  }
}
