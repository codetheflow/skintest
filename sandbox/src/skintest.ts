import { nodePlatform } from '@skintest/platform';
import { exploreNodeProjects, playwrightLauncher, tagFilter, ttyLogo, ttyPause, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';

// if you want to run multiple projects just replace 
// `path.join(__dirname, 'todomvc')` with `__dirname`
const PROJECT_FOLDER = path.join(__dirname, 'qgrid');

const launcher = playwrightLauncher({
  headless: true,
  timeout: 15 * 1000,
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