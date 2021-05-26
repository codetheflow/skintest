import { Suite } from '@skintest/sdk';
import { Attempt } from './attempt';
import { Launcher } from './launcher';
import { orchestrate, Plugin } from './plugin';
import { Project } from './project';
import { Scene } from './scene';

export class NodeProject implements Project {
  constructor(private suite: Suite) { }

  async run(launch: Launcher, ...plugins: Plugin[]): Promise<void> {
    const { suite } = this;
    const attempt = new Attempt(launch.options.retries);

    const effect = orchestrate(Array.from(plugins));

    const start = effect('start');
    const stop = effect('stop');
    const init = effect('init');
    const error = effect('error');

    try {
      await start({ suite });
      await init({ suite });

      const scripts = suite
        .getScripts()
        .filter(x => suite.operations.filterFeature(x.name));

      for (const script of scripts) {
        const browser = await launch.createBrowser();
        try {
          const scene = new Scene(
            suite,
            effect,
            browser,
            attempt
          );

          await scene.play(script);
        } finally {
          await browser.close();
        }
      }

    } catch (ex) {
      await error({ suite, reason: ex });
    } finally {
      await stop({suite});
    }
  }
}