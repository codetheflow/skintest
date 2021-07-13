import { errors } from '@skintest/common';
import { Browser, Page } from '@skintest/sdk';
import * as pw from 'playwright';
import { PlaywrightAction } from './playwright-action';
import { PlaywrightMiddleware } from './playwright-middleware';
import { PlaywrightPage } from './playwright-page';

export class PlaywrightBrowser implements Browser {
  private context: pw.BrowserContext | null = null;
  private pages = new Map<string, PlaywrightPage>();
  private currentPage: PlaywrightPage | null = null;

  constructor(
    private browser: pw.Browser,
    private middleware: PlaywrightMiddleware,
    public timeout: number,
  ) {
  }

  @PlaywrightAction()
  async openPage(id: string): Promise<void> {
    const existingPage = this.pages.get(id);
    if (existingPage) {
      this.currentPage = existingPage;
      return;
    }

    const context = await this.getContext(id);
    const newPage = await context.newPage();
    await this.middleware
      .accept('page:new', {
        id,
        browser: this.browser,
        context,
        page: newPage
      });

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

  private async getContext(id: string): Promise<pw.BrowserContext> {
    if (this.context) {
      return this.context;
    }

    const options = await this.middleware
      .accept('context:new', {
        id,
        browser: this.browser,
        options: {}
      });

    const context = await this.browser.newContext(options);
    this.context = context;
    return context;
  }
}