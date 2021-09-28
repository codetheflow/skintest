import { Guard, Meta, reinterpret } from '@skintest/common';
import { ClientStep, methodResult, StepExecutionResult } from '@skintest/sdk';
import { Browser } from '../browser';

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
    private browser: Browser,
    private download: Download,
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(download, 'download');
  }

  async execute(): Promise<StepExecutionResult> {
    const page = this.browser.getCurrentPage();
    const options = reinterpret<typeof DOWNLOAD_OPTIONS>(this.download);
    return methodResult(page.waitDownload(options));
  }

  toString(): string {
    return 'wait download';
  }
}