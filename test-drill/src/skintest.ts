import { nodePlatform } from '@skintest/platform';
import { exploreNodeFeatures, exploreNodeProjects, playwrightLauncher, playwrightMiddleware, tagFilter, ttyLogo, ttyPause, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';
import * as pw from 'playwright';

const PROJECTS_FOLDER = path.resolve(__dirname, '../..');
const LAUNCH_OPTIONS = {
  timeout: 30 * 1000
}

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

const launcher = playwrightLauncher(
  playwrightMiddleware('browser:type', async () => [pw.chromium])
  , playwrightMiddleware('browser:new', async ({ options }) => ({ ...options, ...LAUNCH_OPTIONS }))
);

nodePlatform(...plugins)
  .then(platform =>
    exploreNodeProjects(PROJECTS_FOLDER)
      // .filter(uri => /todo/.test(uri))
      .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
      .finally(() => platform.destroy())
  )