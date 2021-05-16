import { afterFeature } from '../plugins/after-feature';
import { afterScenario } from '../plugins/after-scenario';
import { afterStep } from '../plugins/after-step';
import { beforeFeature } from '../plugins/before-feature';
import { beforeScenario } from '../plugins/before-scenario';
import { beforeStep } from '../plugins/before-step';
import { plan } from '../plugins/plan';
import { step } from '../plugins/step';
import { Suite } from '../sdk/suite';
import { attemptFactory } from './attempt-factory';
import { BrowserFactory } from './browser-factory';
import { NodeReportSink } from './node-reporting';
import { Plugin, stage } from './plugin';
import { Project } from './project';
import { Scene } from './scene';

export class NodeProject implements Project {
  private readonly corePlugins = [
    afterFeature(plan),
    afterScenario(plan),
    afterStep(plan),
    beforeFeature(plan),
    beforeScenario(plan),
    beforeStep(plan),
    step(plan),
  ];

  constructor(private suite: Suite) { }

  async run(
    createBrowser: BrowserFactory,
    ...plugins: Plugin[]
  ): Promise<void> {

    const RETRIES = 1;

    const reportSink = new NodeReportSink();
    const reporting = await reportSink.start();
    const attempt = attemptFactory(RETRIES, await reporting.attempt());

    const orchestration = [
      ...plugins,
      afterFeature(plan),
      afterScenario(plan),
      afterStep(plan),
      beforeFeature(plan),
      beforeScenario(plan),
      beforeStep(plan),
      step(plan),
    ];

    const effect = stage(orchestration, { reporting, attempt, });
    const init = effect('init');
    const destroy = effect('destroy');

    try {
      init();

      for (let script of this.suite.getScripts()) {
        const browser = await createBrowser();
        try {
          const scene = new Scene(effect, browser);
          await scene.play(script);
        } finally {
          browser.close();
        }
      }

    } finally {
      // todo: add reporting handling ex
      try {
        destroy();
      } finally {
        await reportSink.end(reporting);
      }
    }
  }
}