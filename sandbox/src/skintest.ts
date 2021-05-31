import { nodePlatform } from '@skintest/platform';
import { exploreNodeProjects, playwrightLauncher, tagFilter, ttyLogo, ttyPause, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';
import { env } from './qgrid/project/env';

// if you want to run multiple projects just replace 
// `path.join(__dirname, 'todomvc')` with `__dirname`
const PROJECT_FOLDER = path.join(__dirname, 'qgrid');

const launcher = playwrightLauncher({
  headless: false,
  timeout: 30 * 1000,
  downloadsPath: env.downloads_path,
});

const plugins = [
  ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , ttyPause()
  , tagFilter({
    include: ['#now'],
    method: 'all-when-no-matched',
  })
];

const platform = nodePlatform(...plugins);

exploreNodeProjects(PROJECT_FOLDER)
  .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
  .finally(() => platform.destroy());