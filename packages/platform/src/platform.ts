import { Project } from './project';

export interface Platform<S> {
  destroy(): Promise<void>;
  newProject(uri: string, build: (project: Project<S>) => Promise<void>): Promise<Platform<S>>;
}