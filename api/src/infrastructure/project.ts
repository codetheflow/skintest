import { Suite } from './suite';

export class Project {
  constructor(
    public name: string,
    public suite: Suite,
  ) { }
}

let currentProject = newProject('default');

export function newProject(name: string): Project {
  const suite = new Suite();
  currentProject = new Project(name, suite);
  return currentProject;
}

export function getProject() {
  return currentProject;
}
