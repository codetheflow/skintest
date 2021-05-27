import { NodePlatform } from './node-platform';
import { Plugin } from './plugin';
import { Project } from './project';

export interface Platform {
  newProject(uri: string, build: (project: Project) => Promise<void>): Promise<void>;
}

export function nodePlatform(...plugins: Plugin[]): Platform {
  return new NodePlatform(plugins);
}