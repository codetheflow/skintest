import { Guard, reinterpret } from '@skintest/common';
import { ClientStep, methodResult, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

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

export class WaitDownloadStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
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