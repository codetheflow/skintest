/* eslint-disable regex/invalid */

import { nodePlatform } from '@skintest/platform';
import { playwrightBrowserBuilder } from '@skintest/playwright';
import { exploreNodeFeatures, tagFilter, ttyDebug, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';
import { CanBrowseTheWeb } from '@skintest/web';
import * as path from 'path';
import * as pw from 'playwright';

const PROJECT_FOLDER = path.resolve(__dirname, '../..');
const BROWSER_TYPES = [pw.chromium];

const SETTINGS = {
  retries: 1,
  timeout: 30 * 1000,
  headless: false,
};

const PLUGINS = [
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

// CanWait.useByDefault();
// CanSee.useByDefault();

nodePlatform(PLUGINS)
  .then(platform =>
    platform
      .newProject(PROJECT_FOLDER, async project => {
        for (const type of BROWSER_TYPES) {

          const browser = await playwrightBrowserBuilder()
            .type(type)
            .options({ headless: SETTINGS.headless })
            .timeout(SETTINGS.timeout)
            .build();

          CanBrowseTheWeb.useByDefault(browser);

          await project.run({ retries: SETTINGS.retries });
        }
      })
      .catch(ex => console.error(ex))
      .finally(() => platform.destroy())
  );