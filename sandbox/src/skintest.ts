import { nodePlatform } from '@skintest/platform';
import { exploreNodeProjects, playwrightLauncher, tagFilter, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';

const launcher = playwrightLauncher({
  headless: true,
  timeout: 30 * 1000,
});

const plugins = [
  ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , tagFilter({
    include: ['#now'],
    method: 'all-when-no-matched',
  })
];

const platform = nodePlatform(...plugins);

// if you want to run multiple projects just replace 
// `path.join(__dirname, 'todomvc')` with `__dirname`
exploreNodeProjects(path.join(__dirname, 'todomvc'))
  .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
  .then(() => platform.destroy());