import { Project } from './project';

export interface Platform {
  newProject(name: string, withProject: (project: Project) => Promise<void>): Platform;
}

