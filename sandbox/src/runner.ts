import { newProject, launch, Project } from '@skintest/api';


newProject('submit-a-form', async (project: Project) => {
  require('./pizza-palace/features/submit-a-form');
  await launch(project);
});
