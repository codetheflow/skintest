import { createReport } from './report';
import { PlaywrightEngine } from './playwright';
import { Scene } from './scene';
import { Suite } from './suite';
import * as playwright from 'playwright';

export async function launch(suite: Suite) {
  for (let fixture of suite.getFixtures()) {
    const browser = await playwright['chromium'].launch({ headless: false });
    const context = await browser.newContext();

    const page = await context.newPage();
    const engine = new PlaywrightEngine(page);
    const report = createReport(fixture.name);
    
    const scene = new Scene({
      engine,
      report
    });

    try {
      await scene.play(fixture);
    } finally {
      await browser.close();
    }
  }
}
