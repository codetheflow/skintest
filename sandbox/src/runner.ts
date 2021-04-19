import { platform } from '@skintest/api';
import * as path from 'path';

platform()
  .newProject('pizza-palace', async project => {
    const dir = path.join(__dirname, 'pizza-palace/features');
    await project.addFeaturesFrom(dir);
    await project.run();
  });
