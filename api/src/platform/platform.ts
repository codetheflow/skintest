import { PlaywrightPlatform } from './playwright-platform';
import { Project } from './project';

export interface Platform {
  newProject(name: string, withProject: (project: Project) => Promise<void>): Platform;
}

export function platform(): Platform {
  return new PlaywrightPlatform();
}
