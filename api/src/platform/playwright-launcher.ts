import { NodeReport } from './node-report';
import { PlaywrightEngine } from './playwright-engine';
import { Scene } from './scene';
import { Suite } from '../sdk/suite';
import { playwrightAttempt } from './playwright-attempt';
import * as playwright from 'playwright';

export async function playwrightLauncher(suite: Suite) {
  for (let script of suite.getScripts()) {
    const browser = await playwright['chromium'].launch({ headless: true });
    const context = await browser.newContext();

    const page = await context.newPage();
    const engine = new PlaywrightEngine(page);

    const report = new NodeReport();
    const attempt = playwrightAttempt(1, report.attempt());

    const scene = new Scene(engine, report, attempt);

    try {
      await scene.play(script);
    } finally {
      await browser.close();
    }
  }
}
