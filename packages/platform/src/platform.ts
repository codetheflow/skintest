import { NodePlatform } from './node-platform';
import { Plugin } from './plugin';
import { Project } from './project';

export interface Platform {
  destroy(): Promise<void>;
  newProject(uri: string, build: (project: Project) => Promise<void>): Promise<Platform>;
}

export async function nodePlatform(...plugins: Plugin[]): Promise<Platform> {
  const platform = new NodePlatform(plugins);
  await platform.init();
  return platform;
}