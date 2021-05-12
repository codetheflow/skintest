import * as playwright from 'playwright';
import { noCurrentPage } from '../../common/errors';
import { Browser } from '../../sdk/browser';
import { PlaywrightPage } from './playwright-page';

export class PlaywrightBrowser implements Browser {
  private pages = new Map<string, PlaywrightPage>();
  private currentPage: PlaywrightPage | null = null;

  constructor(
    private context: playwright.BrowserContext,
    private timeout: number
  ) {
  }

  async openPage(id: string): Promise<void> {
    const existingPage = this.pages.get(id);
    if (existingPage) {
      this.currentPage = existingPage;
      return;
    }

    const newPag = await this.context.newPage();
    newPag.setDefaultTimeout(this.timeout);
    newPag.setDefaultNavigationTimeout(this.timeout);

    this.currentPage = new PlaywrightPage(newPag);
    this.pages.set(id, this.currentPage);
  }

  getCurrentPage() {
    if (!this.currentPage) {
      throw noCurrentPage();
    }

    return this.currentPage;
  }
}
