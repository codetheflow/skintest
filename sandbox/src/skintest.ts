import { platform, playwrightLauncher } from '@skintest/platform';
import { consoleReporting, exploreFeatures, tagFilter } from '@skintest/plugins';
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
      , consoleReporting()
    );
  });