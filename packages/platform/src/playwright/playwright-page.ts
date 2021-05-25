import { errors } from '@skintest/common';
import { DOMElement, ElementRef, ElementRefList, KeyboardKey, Page } from '@skintest/sdk';
import * as playwright from 'playwright';
import { PlaywrightAction } from './playwright-action';
import { PlaywrightElement } from './playwright-element';

export class PlaywrightPage implements Page {
  constructor(private page: playwright.Page) {
  }

  @PlaywrightAction()
  close(): Promise<void> {
    return this.page.close();
  }

  @PlaywrightAction()
  goBack(): Promise<void> {
    return this.page.goBack() as Promise<any>;
  }

  @PlaywrightAction()
  goForward(): Promise<void> {
    return this.page.goForward() as Promise<any>;
  }

  @PlaywrightAction()
  reload(): Promise<void> {
    return this.page.reload() as Promise<any>;
  }

  @PlaywrightAction()
  dblclick(selector: string): Promise<void> {
    return this.page.dblclick(selector);
  }

  @PlaywrightAction()
  type(selector: string, value: string): Promise<void> {
    return this.page.type(selector, value);
  }

  @PlaywrightAction()
  check(selector: string): Promise<void> {
    return this.page.check(selector);
  }

  @PlaywrightAction()
  uncheck(selector: string): Promise<void> {
    return this.page.uncheck(selector);
  }

  @PlaywrightAction()
  selectOption(selector: string, label: string): Promise<void> {
    return this.page.selectOption(selector, { label }) as Promise<any>;
  }

  @PlaywrightAction()
  async selectText(selector: string): Promise<void> {
    const element = await this.page.waitForSelector(selector);
    // todo: add timeout option
    return element.selectText();
  }

  @PlaywrightAction()
  goto(url: string): Promise<void> {
    return this.page.goto(url) as Promise<any>;
  }

  @PlaywrightAction()
  waitForNavigation(url: string): Promise<void> {
    return this.page.waitForNavigation({ url }) as Promise<any>;
  }

  @PlaywrightAction()
  click(selector: string): Promise<void> {
    return this.page.click(selector);
  }

  @PlaywrightAction()
  hover(selector: string): Promise<void> {
    return this.page.hover(selector);
  }

  @PlaywrightAction()
  keyPress(key: KeyboardKey): Promise<void> {
    return this.page.keyboard.press(key);
  }

  @PlaywrightAction()
  fill(selector: string, value: string): Promise<void> {
    return this.page.fill(selector, value);
  }

  @PlaywrightAction()
  async focus(selector: string): Promise<void> {
    return this.page.focus(selector);
  }

  @PlaywrightAction()
  pause(): Promise<void> {
    return this.page.pause();
  }

  @PlaywrightAction()
  async query<T extends DOMElement>(selector: string): Promise<ElementRef<T>> {
    const handle = await this.page.waitForSelector(selector);
    if (handle) {
      return new PlaywrightElement<T>(handle, this.page, selector);
    }

    throw errors.elementNotFound(selector);
  }

  @PlaywrightAction()
  async queryList<T extends DOMElement>(selector: string): Promise<ElementRefList<T>> {
    // todo: how to wait for $$?
    return (await this.page.$$(selector))
      .map(handle => new PlaywrightElement(handle, this.page, selector));
  }

  @PlaywrightAction()
  async dbgQuery<T extends DOMElement>(selector: string): Promise<ElementRef<T> | null> {
    const handle = await this.page.$(selector);
    if (handle) {
      return new PlaywrightElement<T>(handle, this.page, selector);
    }

    return null;
  }

  @PlaywrightAction()
  async dbgQueryList<T extends DOMElement>(selector: string): Promise<ElementRefList<T>> {
    return (await this.page.$$(selector))
      .map(handle => new PlaywrightElement(handle, this.page, selector));
  }
}