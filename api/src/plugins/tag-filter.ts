import { Plugin } from '../platform/plugin';
import { OnStage } from '../platform/stage';

type TagFilter = {
  tags: string[],
  include: 'only-matched' | 'all-when-no-matched'
};

export function tagFilter(options: TagFilter): Plugin {
  const { tags, include } = options;

  return async (stage: OnStage) => stage({
    // 'before.scenario': async ({ script, scenario }) => {
    //   // todo: add reporting
    //   const featureHas = matchHashTag(script.name);
    //   const scenarioHas = matchHashTag(scenario);
    //   for (let tag of tags) {
    //     if (featureHas(tag) || scenarioHas(tag)) {
    //       return stageContinue('tag-filter');
    //     }
    //   }

    //   return stageBreak('tag-filter');
    // }
  });
}

// todo: add include and exclude maybe arrays?
function matchHashTag(text: string) {
  text = ('' + text).toLowerCase();
  return (tag: string) => {
    tag = ('' + tag).toLowerCase();

    // todo: make regular expression
    return text.indexOf(tag) >= 0;
  };
}