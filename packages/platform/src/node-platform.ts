import { newSuite } from '@skintest/sdk';
import { nodeFeatureExplorer } from './node-feature-explorer';
import { NodeProject } from './node-project';
import { Platform } from './platform';
import { orchestrate, Plugin } from './plugin';
import { Project } from './project';

export class NodePlatform implements Platform {
  private effect = orchestrate([
    nodeFeatureExplorer(),
    ...this.plugins
  ]);

  constructor(private plugins: Plugin[]) {
    const mount = this.effect('platform:mount');
    mount();
  }

  newProject(uri: string, build: (project: Project) => Promise<void>): Promise<void> {
    const suite = newSuite(uri);
    const project = new NodeProject(suite, this.effect);
    return build(project);
  }

  destroy(): void {
    const unmount = this.effect('platform:unmount');
    unmount();
  }
}