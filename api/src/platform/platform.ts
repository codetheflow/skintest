import { newSuite } from './suite';
import { Project, LocalProject } from './project';


export function platform(): Platform {
  return new LocalPlatform();
}

export interface Platform {
  newProject(name: string, withProject: (project: Project) => Promise<void>): Platform;
}

export class LocalPlatform implements Platform {
  newProject(name: string, build: (project: Project) => void): Platform {
    const suite = newSuite(name);
    const project = new LocalProject(suite);
    build(project);
    return this;
  }
}


// const platform = new Platform();
// platform.newProject()

// platform()
//   .newProject('submit-a-form', async project => {
//     project.addFeaturesFrom('./pizza-palace');
//     await project.launch();
//   });
