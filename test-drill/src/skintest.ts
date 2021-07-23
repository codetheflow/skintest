/* eslint-disable regex/invalid */

import { extend } from '@skintest/common';
import { nodePlatform } from '@skintest/platform';
import { exploreNodeFeatures, exploreNodeProjects, playwrightLauncher, playwrightUse as playwrightUse, tagFilter, ttyDebug, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';
import * as pw from 'playwright';

const PROJECTS_FOLDER = path.resolve(__dirname, '../..');
const LAUNCH_OPTIONS = {
  timeout: 10 * 1000,
  headless: false,
};

const plugins = [
  exploreNodeFeatures()
  , ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , ttyDebug()
  // , hmr({
  //   include: '#now'
  // })
  , tagFilter({
    method: 'include-all-when-no-matches',
    include: ['#now'],
    exclude: ['#skip']
  })
];

const launcher = playwrightLauncher(
  playwrightUse('browser:types', async () => [pw.chromium])
  , playwrightUse('browser:options', async ({ options }) => extend(options, LAUNCH_OPTIONS))
  , playwrightUse('page:new', async ({ page }) => { page.setDefaultTimeout(LAUNCH_OPTIONS.timeout); })
);

nodePlatform(...plugins)
  .then(platform =>
    exploreNodeProjects(PROJECTS_FOLDER)
      .filter(uri => /todomvc/.test(uri))
      .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
      .finally(() => platform.destroy())
  );