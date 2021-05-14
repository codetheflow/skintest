import { Plugin, pluginBreak, PluginContext, pluginContinue } from '../platform/plugin';

export function tagFilter(...tags: string[]): Plugin {
  return async (context: PluginContext) => {
    const { stage } = context;
    return stage({
      'before.scenario': async ({ script, scenario }) => {
        // todo: add reporting
        const featureHas = matchHashTag(script.name);
        const scenarioHas = matchHashTag(scenario);
        for (let tag of tags) {
          if (featureHas(tag) || scenarioHas(tag)) {
            return pluginContinue('tag-filter');
          }
        }

        return pluginBreak('tag-filter');
      }
    });
  };
}

// todo: add include and exclude maybe arrays?
export function matchHashTag(text: string) {
  text = ('' + text).toLowerCase();
  return (tag: string) => {
    tag = ('' + tag).toLowerCase();

    // todo: make regular expression
    return text.indexOf(tag) >= 0;
  };
}