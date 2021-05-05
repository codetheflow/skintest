import { newSuite } from '../sdk/suite';
import { PlaywrightProject } from './playwright-project';
import { Platform } from './platform';
import { Project } from './project';

export class PlaywrightPlatform implements Platform {
  newProject(name: string, build: (project: Project) => void): Platform {
    const suite = newSuite(name);
    const project = new PlaywrightProject(suite);
    build(project);
    return this;
  }
}

export function platform(): Platform {
  return new PlaywrightPlatform();
}
