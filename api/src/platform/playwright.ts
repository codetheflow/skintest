import * as playwright from 'playwright';
import { Engine } from './engine';

export class PlaywrightEngine implements Engine {
  constructor(private page: playwright.Page) {
  }

  pause(): Promise<void> {
    return this.page.pause();
  }

  select<T>(query: string): T | null {
    return this.page.$(query) as any;
  }

  selectAll<T>(query: string): T[] {
    return this.page.$$(query) as any;
  }

  goto(url: string): Promise<void> {
    return this.page.goto(url) as Promise<any>;
  }

  waitForNavigation(url: string): Promise<void> {
    return this.page.waitForNavigation({ url }) as Promise<any>;
  }

  click(query: string): Promise<void> {
    return this.page.click(query) as Promise<any>;
  }

  press(key: string): Promise<void> {
    return this.page.press('document', key);
  }

  fill(query: string, value: string): Promise<void> {
    return this.page.fill(query, value);

  }

  focus(query: string): Promise<void> {
    return this.page.focus(query);

  }

  drag(target: string, x: number, y: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  attachFile(target: string, file: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
