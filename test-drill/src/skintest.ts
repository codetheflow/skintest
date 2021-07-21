import { nodePlatform } from '@skintest/platform';
import { exploreNodeFeatures, exploreNodeProjects, playwrightLauncher, tagFilter, ttyLogo, ttyPause, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';

const PROJECTS_FOLDER = path.resolve(__dirname, '../..');

const launcher = playwrightLauncher({
  headless: true,
  timeout: 30 * 1000,
});

const plugins = [
  exploreNodeFeatures()
  , ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , ttyPause()
  , tagFilter({
    method: 'include-all-when-no-matches',
    include: ['#now'],
  })
];

nodePlatform(...plugins)
  .then(platform =>
    exploreNodeProjects(PROJECTS_FOLDER)
      // .filter(uri => /todo/.test(uri))
      .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
      .finally(() => platform.destroy())
  )