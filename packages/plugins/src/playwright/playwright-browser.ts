import { errors } from '@skintest/common';
import { Browser, Page } from '@skintest/sdk';
import * as playwright from 'playwright';
import { PlaywrightAction } from './playwright-action';
import { PlaywrightPage } from './playwright-page';

export class PlaywrightBrowser implements Browser {
  private context: playwright.BrowserContext | null = null;
  private pages = new Map<string, PlaywrightPage>();
  private currentPage: PlaywrightPage | null = null;

  constructor(
    private browser: playwright.Browser,
    public timeout: number
  ) {
  }

  @PlaywrightAction()
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

  @PlaywrightAction()
  async closePage(id: string): Promise<void> {
    const existingPage = this.pages.get(id);
    if (!existingPage) {
      throw errors.pageNotFound(id);
    }

    return existingPage.close();
  }

  @PlaywrightAction()
  close(): Promise<void> {
    return this.browser.close();
  }

  getCurrentPage(): Page {
    if (!this.currentPage) {
      throw errors.noCurrentPage();
    }

    return this.currentPage;
  }

  private async getContext(): Promise<playwright.BrowserContext> {
    if (this.context) {
      return this.context;
    }

    const context = await this.browser.newContext({ acceptDownloads: true });
    this.context = context;
    return context;
  }
}