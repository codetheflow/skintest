import { errors } from '@skintest/common';
import { Browser, Page } from '@skintest/web';
import * as pw from 'playwright';
import { PlaywrightAction } from './playwright-action';
import { PlaywrightMiddleware } from './playwright-middleware';
import { PlaywrightPage } from './playwright-page';

export class PlaywrightBrowser implements Browser {
  private context: pw.BrowserContext | null = null;
  private pages = new Map<string, PlaywrightPage>();
  private currentPage: PlaywrightPage | null = null;

  constructor(
    public browser: pw.Browser,
    private middleware: PlaywrightMiddleware,
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
    const page = await context.newPage();
    const newPage = await this.middleware
      .accept('page:new', {
        id,
        browser: this.browser,
        state: page,
      });

    this.currentPage = new PlaywrightPage(newPage);
    this.pages.set(id, this.currentPage);
  }

  @PlaywrightAction()
  closePage(id: string): Promise<void> {
    const page = this.pages.get(id);
    if (!page) {
      throw errors.pageNotFound(id);
    }

    if (this.currentPage === page) {
      this.currentPage = null;
    }

    this.pages.delete(id);
    return page.close();
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

  async clear(): Promise<void> {
    const pages = this.pages.entries();
    for (const [id] of pages) {
      await this.closePage(id);
    }

    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }

  private async getContext(id: string): Promise<pw.BrowserContext> {
    if (this.context) {
      return this.context;
    }

    return this.newContext(id);
  }

  private async newContext(id: string): Promise<pw.BrowserContext> {
    const options = await this.middleware
      .accept('context:options', {
        id,
        browser: this.browser,
        state: {}
      });

    const context = await this.browser.newContext(options);
    this.context = context;
    return context;
  }
}