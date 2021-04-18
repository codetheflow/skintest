import { Suite } from './suite';

export class Project {
  constructor(
    public name: string,
    public suite: Suite,
  ) { }
}

let currentProject: Project;
newProject('default', project => {
  currentProject = project;
});

export function newProject(name: string, inScope: (project: Project) => void): void {
  const suite = new Suite();
  currentProject = new Project(name, suite);

  inScope(currentProject);
}

export function getProject() {
  return currentProject;
}
