import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class WaitDownloadStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    public path: string,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(path, 'path');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;
    const page = browser.getCurrentPage();
    return methodResult(page.waitDownload(this.path));
  }

  toString(): string {
    return `I wait download \`${this.path}\``;
  }
}