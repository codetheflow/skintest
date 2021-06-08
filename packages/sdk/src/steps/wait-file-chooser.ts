import { Guard } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class WaitFileChooserStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    public paths: string[],
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(paths, 'paths');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;
    const page = browser.getCurrentPage();
    return methodResult(page.waitFileChooser(this.paths));
  }

  toString(): string {
    // todo: better toString
    return `I wait file-chooser \`${this.paths}\``;
  }
}