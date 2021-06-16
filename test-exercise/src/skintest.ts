import { nodePlatform } from '@skintest/platform';
import { exploreNodeProjects, playwrightLauncher, tagFilter, ttyLogo, ttyPause, ttyReport, ttySummaryReport } from '@skintest/plugins';
import * as path from 'path';

const PROJECTS_FOLDER = path.join(__dirname);

const launcher = playwrightLauncher({
  headless: false,
  timeout: 30 * 1000,
});

const plugins = [
  ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , ttyPause()
  , tagFilter({
    method: 'include-all-when-no-matches',
    include: ['#now'],
  })
];

const platform = nodePlatform(...plugins);

exploreNodeProjects(PROJECTS_FOLDER)
  // if you want to run multiple projects just 
  // comment out filter function or modify the filter predicate
  .filter(uri => /todo/.test(uri))
  .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
  .finally(() => platform.destroy());