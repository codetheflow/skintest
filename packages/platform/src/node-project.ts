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
    const attempt = new Attempt(launch.options.retries);

    const mount = effect('project:mount');
    const unmount = effect('project:unmount');
    const init = effect('project:init');
    const error = effect('project:error');

    try {
      await mount({ suite });
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
      await unmount({ suite });
    }
  }
}