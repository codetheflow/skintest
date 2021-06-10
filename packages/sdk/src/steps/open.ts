import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class OpenStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private name: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(name, 'name');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    return methodResult(browser.openPage(this.name));
  }

  toString(): string {
    return `open ${this.name}`;
  }
}