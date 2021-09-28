import { Suite } from '@skintest/sdk';
import { Attempt } from './attempt';
import { Project } from './project';
import { Scene } from './scene';
import { Staging } from './stage';

export interface NodeProjectSettings {
  retries: number;
}

export class NodeProject implements Project<NodeProjectSettings> {
  constructor(private suite: Suite, private effect: Staging) { }

  async run(settings: NodeProjectSettings): Promise<void> {
    const { suite, effect } = this;

    const attempt = new Attempt(settings.retries);

    const mount = effect('project:mount');
    const unmount = effect('project:unmount');
    const ready = effect('project:ready');
    const error = effect('project:error');

    try {
      await mount({ suite });
      await ready({ suite });

      for (const script of suite.getScripts()) {
        const scene = new Scene(
          suite,
          effect,
          attempt
        );

        await scene.play(script);

      }
    } catch (ex) {
      await error({ suite, reason: ex });
    } finally {
      await unmount({ suite });
    }
  }
}