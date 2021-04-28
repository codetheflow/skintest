import { DOMElement } from '../integration/dom';
import { ElementRef, Engine } from '../integration/engine';
import { KeyboardKey } from '../integration/keyboard';
import * as playwright from 'playwright';

export class PlaywrightEngine implements Engine {
  constructor(private page: playwright.Page) {
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

  press(key: KeyboardKey): Promise<void> {
    return this.page.keyboard.press(key);
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

  pause(): Promise<void> {
    return this.page.pause();
  }

  select<T extends DOMElement>(query: string): Promise<ElementRef<T> | null> {
    return this.page.$(query);
  }

  selectAll<T extends DOMElement>(query: string): Promise<ElementRef<T>[]> {
    return this.page.$$(query);
  }
}
