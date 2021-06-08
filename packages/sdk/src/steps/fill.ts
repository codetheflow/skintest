import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query } from '../query';

export class FillStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query,
    private value: string,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return methodResult(page.fill(selector, this.value));
  }

  toString(): string {
    const selector = this.query.toString();
    return `I fill ${formatSelector(selector)} with \`${this.value}\``;
  }
}