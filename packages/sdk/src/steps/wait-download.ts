import { Guard, Meta, reinterpret } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';

export interface Download {
  save(path: string): Download;
}

const DOWNLOAD_OPTIONS = {
  saveAs: '',

  save(path: string): Download {
    this.saveAs = path;
    return this;
  }
};

export const download = DOWNLOAD_OPTIONS as Download;

export class WaitDownloadStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private download: Download,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(download, 'download');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const { browser } = context;
    
    const page = browser.getCurrentPage();
    const options = reinterpret<typeof DOWNLOAD_OPTIONS>(download);
    return methodResult(page.waitDownload(options));
  }

  toString(): string {
    return 'wait download';
  }
}