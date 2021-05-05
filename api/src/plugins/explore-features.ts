import { Plugin, PluginContext, pluginContinue } from '../platform/plugin';

import * as glob from 'glob';
import * as path from 'path';

export async function exploreFeatures(dir: string): Promise<Plugin> {
  // TODO: do we need to make it real async?
  // TODO: reporting
  const files = glob.sync('*.js', { cwd: dir });
  console.log(`found ${files.length} feature file(s)`);
  for (let file of files) {
    const feature = path.join(dir, file);
    // console.log(`add feature: ${feature}`);

    try {
      require(feature);
    } catch (ex) {
      console.log(ex);
    }
  }

  return async (context: PluginContext) => {
    return pluginContinue('add-features-from');
  };
}