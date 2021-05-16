import { NodePlatform } from './node-platform';
import { Project } from './project';

export interface Platform {
  newProject(name: string, withProject: (project: Project) => Promise<void>): Platform;
}

export function platform(): Platform {
  return new NodePlatform();
}
