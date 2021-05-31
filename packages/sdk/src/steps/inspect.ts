import { errors, Guard, isString, reinterpret } from '@skintest/common';
import { DevStep, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { Query, QueryList } from '../query';
import { inspect } from '../test-result';

export class InspectStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: string | Query | QueryList
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): StepExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();

    // todo: get rid of `any`
    const type = isString(this.query) ? 'queryList' : reinterpret<Query>(this.query).type;
    switch (type) {
      case 'query': {
        const target = await page.immediateQuery(selector);
        return {
          result: inspect({ selector, target }),
          plans: [],
        };
      }

      case 'queryList': {
        const target = await page.immediateQueryList(selector);
        return {
          result: inspect({ selector, target }),
          plans: [],
        };
      }

      default: {
        throw errors.invalidArgument('type', type);
      }
    }
  }

  toString(): string {
    return '__inspect';
  }
}