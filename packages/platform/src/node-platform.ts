import { newSuite } from '@skintest/sdk';
import { NodeProject } from './node-project';
import { Platform } from './platform';
import { orchestrate, Plugin } from './plugin';
import { Project } from './project';

export class NodePlatform implements Platform {
  private effect = orchestrate([
    ...this.plugins
  ]);

  constructor(private plugins: Plugin[]) { }

  async init(): Promise<void> {
    const mount = this.effect('platform:mount');
    const ready = this.effect('platform:ready');
    const error = this.effect('platform:error');
    try {
      await mount();
      await ready();
    } catch (ex) {
      await error({ reason: ex });
      throw ex;
    }
  }

  newProject(uri: string, build: (project: Project) => Promise<void>): Promise<void> {
    const suite = newSuite(uri);
    const project = new NodeProject(suite, this.effect);
    return build(project);
  }

  async destroy(): Promise<void> {
    const unmount = this.effect('platform:unmount');
    await unmount();
  }
}