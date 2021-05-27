import { platform } from '@skintest/platform';
import { exploreFeatures, exploreNodeProjects, NodeProjectSite, playwrightLauncher, tagFilter, ttyLogo, ttyReport, ttySummaryReport } from '@skintest/plugins';

const start = (site: NodeProjectSite) =>
  platform()
    .newProject(site.name, async project => {
      await project.run(
        playwrightLauncher({
          headless: true,
          timeout: 30 * 1000,
        })
        , exploreFeatures({
          cwd: site.featuresPath
        })
        , tagFilter({
          tags: ['#now'],
          include: 'all-when-no-matched',
        })
        , ttyLogo()
        , ttyReport()
        , ttySummaryReport()
      );
    })

exploreNodeProjects(__dirname)
  .forEach(start);