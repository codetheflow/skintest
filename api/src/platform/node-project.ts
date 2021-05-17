import { Suite } from '../sdk/suite';
import { attemptFactory } from './attempt-factory';
import { BrowserFactory } from './browser-factory';
import { orchestrate, Plugin } from './plugin';
import { Project } from './project';
import { Scene } from './scene';

export class NodeProject implements Project {
  constructor(private suite: Suite) { }

  async run(createBrowser: BrowserFactory, ...plugins: Plugin[]): Promise<void> {
    // todo: add config
    const RETRIES = 1;
    const attempt = attemptFactory(RETRIES);

    const effect = orchestrate(Array.from(plugins));

    const init = effect('init');
    const destroy = effect('destroy');
    const fail = effect('fail');
    const pass = effect('pass');

    try {
      init();
      await pass({ site: 'init' });
    } catch (ex) {
      await fail({ site: 'init', result: ex });
    }

    try {
      for (let script of this.suite.getScripts()) {
        const browser = await createBrowser();
        try {
          const scene = new Scene(effect, browser);
          await scene.play(script);
        } finally {
          browser.close();
        }
      }

      await pass({ site: 'runtime' });
    } catch (ex) {
      await fail({ site: 'runtime', result: ex });
    }

    try {
      destroy();
      pass({ site: 'destroy' });
    } catch (ex) {
      fail({ site: 'destroy', result: ex });
    }
  }
}
