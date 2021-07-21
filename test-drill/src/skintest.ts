/* eslint-disable regex/invalid */

import { nodePlatform } from '@skintest/platform';
import { exploreNodeFeatures, exploreNodeProjects, hmr, playwrightLauncher, playwrightMiddleware, tagFilter, ttyDebug, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';
import * as pw from 'playwright';

const PROJECTS_FOLDER = path.resolve(__dirname, '../..');
const LAUNCH_OPTIONS = {
  timeout: 10 * 1000
}

const plugins = [
  exploreNodeFeatures()
  , ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , ttyDebug()
  , hmr({
    include: '#now'
  })
  , tagFilter({
    method: 'include-all-when-no-matches',
    include: ['#now'],
  })
];

const launcher = playwrightLauncher(
  playwrightMiddleware('browser:type', async () => [pw.chromium])
  , playwrightMiddleware('browser:new', async ({ options }) => ({ ...options, ...LAUNCH_OPTIONS }))
  , playwrightMiddleware('page:new', async ({ page }) => { page.setDefaultTimeout(LAUNCH_OPTIONS.timeout); })
);

nodePlatform(...plugins)
  .then(platform =>
    exploreNodeProjects(PROJECTS_FOLDER)
      .filter(uri => /todomvc/.test(uri))
      .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
      .finally(() => platform.destroy())
  )