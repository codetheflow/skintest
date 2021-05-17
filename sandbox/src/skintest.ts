import { exploreFeatures, platform, playwrightLauncher, stdReporting, tagFilter } from '@skintest/api';
import * as path from 'path';

platform()
  .newProject('todomvc', async project => {
    const dir = path.join(__dirname, 'todomvc/features');

    await project.run(
      playwrightLauncher()
      , exploreFeatures({ dir })
      , tagFilter({
        tags: ['#dev'],
        include: 'all-when-no-matched',
      })
      , stdReporting()
    );
  });