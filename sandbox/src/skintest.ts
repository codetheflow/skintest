import { platform } from '@skintest/platform';
import { exploreFeatures, playwrightLauncher, tagFilter, ttyLogo, ttyReport } from '@skintest/plugins';
import * as path from 'path';

platform()
  .newProject('todomvc', async project => {
    const dir = path.join(__dirname, 'todomvc/features');

    await project.run(
      playwrightLauncher({
        headless: true,
        timeout: 30 * 1000,
      })
      , exploreFeatures({
        dir
      })
      , tagFilter({
        tags: ['#now'],
        include: 'all-when-no-matched',
      })
      , ttyLogo()
      , ttyReport()
    );
  });