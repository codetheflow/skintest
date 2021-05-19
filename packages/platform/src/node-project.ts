import { orchestrate, Plugin, Suite } from '@skintest/sdk';
import { Attempt } from './attempt';
import { BrowserFactory } from './browser-factory';
import { Project } from './project';
import { Scene } from './scene';

export class NodeProject implements Project {
  constructor(private suite: Suite) { }

  async run(createBrowser: BrowserFactory, ...plugins: Plugin[]): Promise<void> {
    const { suite } = this;

    // todo: add config
    const RETRIES = 1;
    const attempt = new Attempt(RETRIES);

    const effect = orchestrate(Array.from(plugins));

    const start = effect('start');
    const stop = effect('stop');
    const init = effect('init');
    const error = effect('error');

    try {
      await start();
      await init({ suite });

      const scripts = suite
        .getScripts()
        .filter(x => suite.operations.filterFeature(x.name));

      for (let script of scripts) {
        const browser = await createBrowser();
        try {
          const scene = new Scene(
            effect,
            browser,
            suite.operations,
            attempt
          );

          await scene.play(script);
        } finally {
          await browser.close();
        }
      }

    } catch (ex) {
      await error({ reason: ex });
    } finally {
      await stop();
    }
  }
}
