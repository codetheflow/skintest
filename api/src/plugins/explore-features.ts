import { Plugin, PluginContext, pluginContinue } from '../platform/plugin';

import * as glob from 'glob';
import * as path from 'path';

export function exploreFeatures(dir: string): Plugin {
  return (context: PluginContext) => {
    const { stage } = context;
    return stage({
      'init': async () => {
        // todo: do we need to make it real async?
        // todo: reporting
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

        return pluginContinue('explore-features');
      }
    });
  };
}