import { DOMElement } from '../../sdk/dom';
import { ElementRef, ElementRefList, Driver } from '../../sdk/driver';
import { KeyboardKey } from '../../sdk/keyboard';
import { PlaywrightElement } from './playwright-element';
import * as playwright from 'playwright';

export class PlaywrightDriver implements Driver {
  constructor(private page: playwright.Page) {
  }

  goto(url: string): Promise<void> {
    return this.page.goto(url) as Promise<any>;
  }

  waitForNavigation(url: string): Promise<void> {
    return this.page.waitForNavigation({ url }) as Promise<any>;
  }

  click(selector: string): Promise<void> {
    return this.page.click(selector);
  }

  hover(selector: string): Promise<void> {
    return this.page.hover(selector);
  }

  press(key: KeyboardKey): Promise<void> {
    return this.page.keyboard.press(key);
  }

  fill(selector: string, value: string): Promise<void> {
    return this.page.fill(selector, value);
  }

  focus(selector: string): Promise<void> {
    return this.page.focus(selector);
  }

  // todo: implement
  drag(target: string, x: number, y: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  attachFile(target: string, file: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  pause(): Promise<void> {
    return this.page.pause();
  }

  async select<T extends DOMElement>(selector: string): Promise<ElementRef<T> | null> {
    const handle = await this.page.$(selector);
    if (handle) {
      return new PlaywrightElement<T>(handle, this.page, selector);
    }

    return null;
  }

  async selectAll<T extends DOMElement>(selector: string): Promise<ElementRefList<T>> {
    return (await this.page.$$(selector))
      .map(handle => new PlaywrightElement(handle, this.page, selector));
  }
}
