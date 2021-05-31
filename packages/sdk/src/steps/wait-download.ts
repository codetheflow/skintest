import { Guard } from '@skintest/common';
import { asTest, ClientStep, StepContext, StepExecutionResult } from '../command';
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

  async execute(context: StepContext): StepExecutionResult {
    const { browser } = context;
    const page = browser.getCurrentPage();
    return asTest(page.waitDownload(this.path));
  }

  toString(): string {
    return `I wait download \`${this.path}\``;
  }
}