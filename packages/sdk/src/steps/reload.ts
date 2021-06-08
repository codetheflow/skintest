import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class ReloadStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
  ) {
    Guard.notNull(getMeta, 'getMeta');
  }

  execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return methodResult(page.reload());
  }

  toString(): string {
    return `I reload`;
  }
}