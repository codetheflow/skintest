import * as playwright from 'playwright';
import { noCurrentPage, pageNotFoundError } from '../../common/errors';
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

    const newPage = await this.context.newPage();
    newPage.setDefaultTimeout(this.timeout);
    newPage.setDefaultNavigationTimeout(this.timeout);

    this.currentPage = new PlaywrightPage(newPage);
    this.pages.set(id, this.currentPage);
  }

  async closePage(id: string): Promise<void> {
    const existingPage = this.pages.get(id);
    if (!existingPage) {
      throw pageNotFoundError(id);
    }

    return existingPage.close();
  }

  getCurrentPage() {
    if (!this.currentPage) {
      throw noCurrentPage();
    }

    return this.currentPage;
  }
}
