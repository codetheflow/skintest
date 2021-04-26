import { ConsoleReport } from './console-report';
import { PlaywrightEngine } from './playwright-engine';
import { Scene } from './scene';
import { Suite } from '../integration/suite';
import { playwrightAttempt } from './playwright-attempt';
import * as playwright from 'playwright';

export async function playwrightLauncher(suite: Suite) {
  for (let script of suite.getScripts()) {
    const browser = await playwright['chromium'].launch({ headless: false });
    const context = await browser.newContext();

    const page = await context.newPage();
    const engine = new PlaywrightEngine(page);

    const report = new ConsoleReport();
    const attempt = playwrightAttempt(1, report.attempt());

    const scene = new Scene(engine, report, attempt);

    try {
      await scene.play(script);
    } finally {
      await browser.close();
    }
  }
}
