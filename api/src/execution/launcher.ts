import { createReport } from '../infrastructure/report';
import { PlaywrightEngine } from './playwright';
import { Project } from '../infrastructure/project';
import { Scene } from './scene';
import * as playwright from 'playwright';

export async function launch(project: Project) {
  const { suite } = project;
  for (let fixture of suite.getFixtures()) {
    const browser = await playwright['chromium'].launch();
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
