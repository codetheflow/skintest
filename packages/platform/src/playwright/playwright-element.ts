import { DOMElement, ElementRef } from '@skintest/sdk';
import * as playwright from 'playwright';

export class PlaywrightElement<T extends DOMElement> implements ElementRef<T> {
  constructor(
    private handle: playwright.ElementHandle<DOMElement>,
    private page: playwright.Page,
    private selector: string,
  ) {
  }

  async value(): Promise<string> {
    const value = await this.page.$eval<any, HTMLInputElement>(this.selector, (el) => el.value)
    return value;;
  }

  async hasFocus(): Promise<boolean> {
    const hasFocus = await this.page.$eval(this.selector, (el) => el === document.activeElement)
    return hasFocus;
  }

  async innerText(): Promise<string> {
    const value = await this.handle?.innerText();
    return value || '';
  }
}
