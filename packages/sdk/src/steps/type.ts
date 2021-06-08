import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';
import { Query } from '../query';

export class TypeStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query,
    private text: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(text, 'text');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return methodResult(page.type(selector, this.text));
  }

  toString(): string {
    return `I type ${this.text}`;
  }
}