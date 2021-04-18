import { launch, newProject } from '@skintest';

const project = newProject('submit-a-form');
import '../projects/pizza-palace/features/submit-a-form';

await launch(project);
