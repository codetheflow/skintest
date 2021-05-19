import { noCurrentPageError, pageNotFoundError } from '@skintest/common';
import { Browser } from '@skintest/sdk';
import * as playwright from 'playwright';
import { PlaywrightPage } from './playwright-page';

export class PlaywrightBrowser implements Browser {
  private context: playwright.BrowserContext | null = null;

  private pages = new Map<string, PlaywrightPage>();
  private currentPage: PlaywrightPage | null = null;

  constructor(
    private browser: playwright.Browser,
    private timeout: number
  ) {
  }

  async openPage(id: string): Promise<void> {
    const existingPage = this.pages.get(id);
    if (existingPage) {
      this.currentPage = existingPage;
      return;
    }

    const context = await this.getContext();
    const newPage = await context.newPage();
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
      throw noCurrentPageError();
    }

    return this.currentPage;
  }

  close(): Promise<void> {
    return this.browser.close();
  }

  private async getContext(): Promise<playwright.BrowserContext> {
    if (this.context) {
      return this.context;
    }

    const context = await this.browser.newContext();
    this.context = context;
    return context;
  }
}
