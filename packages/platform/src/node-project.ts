import { Suite } from '@skintest/sdk';
import { Attempt } from './attempt';
import { Launcher } from './launcher';
import { Project } from './project';
import { Scene } from './scene';
import { Staging } from './stage';

export class NodeProject implements Project {
  constructor(private suite: Suite, private effect: Staging) { }

  async run(launch: Launcher): Promise<void> {
    const { suite, effect } = this;

    // todo: make it as a settings
    const retries = 1;
    const attempt = new Attempt(retries);

    const mount = effect('project:mount');
    const unmount = effect('project:unmount');
    const ready = effect('project:ready');
    const error = effect('project:error');

    try {
      await mount({ suite });
      await ready({ suite });

      const scripts = suite
        .getScripts()
        .filter(x => suite.operations.filterFeature(x.name));

      const browserFactories = await launch.getBrowsers();
      for (const script of scripts) {
        for (const browserFactory of browserFactories) {
          const browser = await browserFactory();
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
      }

    } catch (ex) {
      await error({ suite, reason: ex });
    } finally {
      await unmount({ suite });
    }
  }
}