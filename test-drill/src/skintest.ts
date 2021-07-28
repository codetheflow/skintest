/* eslint-disable regex/invalid */

import { nodePlatform } from '@skintest/platform';
import { playwrightLauncherBuilder } from '@skintest/playwright';
import { exploreNodeFeatures, tagFilter, ttyDebug, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';
import * as pw from 'playwright';

const PROJECTS_FOLDER = path.resolve(__dirname, '../..');
const LAUNCH_OPTIONS: pw.LaunchOptions = {
  timeout: 10 * 1000,
  headless: false,
};

const plugins = [
  exploreNodeFeatures({ grep: /.*todomvc.*/ })
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

const launcher = playwrightLauncherBuilder()
  .browserTypes(pw.chromium)
  .browserOptions(LAUNCH_OPTIONS)
  .timeout(LAUNCH_OPTIONS.timeout || 30 * 1000)
  .build();

nodePlatform(...plugins)
  .then(platform =>
    platform
      .newProject(PROJECTS_FOLDER, project => project.run(launcher))
      .finally(() => platform.destroy())
  );