import { launch, newProject, Project } from '@skintest/api';

const project = newProject('submit-a-form');
import '../projects/pizza-palace/features/submit-a-form';
run(project);

async function run(project: Project) {
  await launch(project);
}
