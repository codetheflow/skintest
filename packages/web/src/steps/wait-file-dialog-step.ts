import { Guard, Meta, reinterpret } from '@skintest/common';
import { ClientStep, methodResult, StepExecutionResult } from '@skintest/sdk';
import { Browser } from '../browser';

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
    private browser: Browser,
    private options: FileDialog,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(options, 'options');
  }

  async execute(): Promise<StepExecutionResult> {
    const page = this.browser.getCurrentPage();
    const options = reinterpret<typeof FILE_DIALOG_OPTIONS>(this.options);
    return methodResult(page.waitFileChooser(options));
  }

  toString(): string {
    return 'wait file-chooser';
  }
}