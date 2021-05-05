import { Plugin, pluginBreak, PluginContext, pluginContinue } from '../platform/plugin';

export function tagFilter(...tags: string[]): Plugin {
  return async (context: PluginContext) => {
    const { stage, reporting } = context;
    return stage({
      'before.scenario': async ({ scenario }) => {
        // todo: add reporting
        const scenarioHas = matchHashTag(scenario);
        for (let tag of tags) {
          if (scenarioHas(tag)) {
            return pluginContinue('tag-filter');
          }
        }

        return pluginBreak('tag-filter');
      }
    });
  };
}

export function matchHashTag(text: string) {
  text = ('' + text).toLowerCase();
  return (tag: string) => {
    tag = ('' + tag).toLowerCase();

    // todo: make regular expression
    return text.indexOf(tag) >= 0;
  };
}