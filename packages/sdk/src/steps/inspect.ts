import { errors, Guard, isString, Meta, reinterpret } from '@skintest/common';
import { DevStep, StepContext, StepExecutionResult } from '../command';
import { Query, QueryList } from '../query';

export class InspectStep<D> implements DevStep<D> {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<Meta>,
    private query: string | Query | QueryList
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();

    // todo: get rid of `any`
    const type = isString(this.query) ? 'queryList' : reinterpret<Query>(this.query).type;
    switch (type) {
      case 'query': {
        const target = await page.immediateQuery(selector);
        return {
          type: 'inspect',
          info: { selector, target },
        };
      }

      case 'queryList': {
        const target = await page.immediateQueryList(selector);
        return {
          type: 'inspect',
          info: { selector, target },
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