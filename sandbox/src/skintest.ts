import { nodePlatform } from '@skintest/platform';
import { exploreNodeProjects, playwrightLauncher, tagFilter, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';

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
exploreNodeProjects(__dirname)
  .forEach(uri => platform.newProject(uri, project => project.run(launcher)))
  .then(() => platform.destroy());