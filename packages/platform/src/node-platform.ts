import { newSuite } from '@skintest/sdk';
import { NodeProject, NodeProjectSettings } from './node-project';
import { Platform } from './platform';
import { orchestrate, Plugin } from './plugin';
import { Project } from './project';

export async function nodePlatform<S extends NodeProjectSettings>(plugins: Plugin[]): Promise<Platform<S>> {
  const platform = new NodePlatform(plugins);
  await platform.init();
  return platform;
}

class NodePlatform<S extends NodeProjectSettings> implements Platform<S> {
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

  async newProject(uri: string, build: (project: Project<S>) => Promise<void>): Promise<Platform<S>> {
    const suite = newSuite(uri);
    const project = new NodeProject(suite, this.effect);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await build(project as any);
    return this;
  }

  async destroy(): Promise<void> {
    const unmount = this.effect('platform:unmount');
    await unmount();
  }
}