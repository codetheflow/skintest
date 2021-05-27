import { nodePlatform } from '@skintest/platform';
import { exploreNodeProjects, NodeProjectSite, playwrightLauncher, tagFilter, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';

const design = nodePlatform(
  ttyLogo()
  , ttyReport()
  , ttySummaryReport()
  , tagFilter({
    tags: ['#now'],
    include: 'all-when-no-matched',
  })
);

function execute(site: NodeProjectSite) {
  return design
    .newProject(site.path, project =>
      project.run(
        playwrightLauncher({
          headless: true,
          timeout: 30 * 1000,
        })
      )
    );
}

exploreNodeProjects(__dirname)
  .forEach(execute);