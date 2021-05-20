import { newSuite } from '@skintest/sdk';
import { NodeProject } from './node-project';
import { Platform } from './platform';
import { Project } from './project';

export class NodePlatform implements Platform {
  newProject(name: string, build: (project: Project) => void): Platform {
    const suite = newSuite(name);
    const project = new NodeProject(suite);
    build(project);
    return this;
  }
}