import { Guard, Meta, reinterpret } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';

export interface FileDialog {
  open(...files: string[]): FileDialog;
}

const FILE_DIALOG_OPTIONS = {
  files: [] as string[],

  open(...files: string[]): FileDialog {
    this.files = files;
    return this;
  }
};

export const fileDialog = FILE_DIALOG_OPTIONS as FileDialog;

export class WaitFileDialogStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private options: FileDialog,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(options, 'options');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const options = reinterpret<typeof FILE_DIALOG_OPTIONS>(this.options);
    return methodResult(page.waitFileChooser(options));
  }

  toString(): string {
    return 'wait file-chooser';
  }
}