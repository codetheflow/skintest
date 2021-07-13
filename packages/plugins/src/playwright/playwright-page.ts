import { Data, reinterpret } from '@skintest/common';
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
    return reinterpret<Promise<void>>(this.page.goBack());
  }

  @PlaywrightAction()
  goForward(): Promise<void> {
    return reinterpret<Promise<void>>(this.page.goForward());
  }

  @PlaywrightAction()
  reload(): Promise<void> {
    return reinterpret<Promise<void>>(this.page.reload());
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
    return reinterpret<Promise<void>>(this.page.selectOption(selector, { label }));
  }

  @PlaywrightAction()
  async selectText(selector: string): Promise<void> {
    const element = await this.page.waitForSelector(selector);
    // todo: add timeout option
    return element.selectText();
  }

  @PlaywrightAction()
  goto(url: string): Promise<void> {
    return reinterpret<Promise<void>>(this.page.goto(url));
  }

  @PlaywrightAction()
  waitForNavigation(url: string): Promise<void> {
    return reinterpret<Promise<void>>(this.page.waitForNavigation({ url }));
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
  waitDownload(options: { saveAs: string }): Promise<void> {
    return this.page
      .waitForEvent('download')
      .then(x => x.saveAs(options.saveAs));
  }

  @PlaywrightAction()
  async waitFileChooser(options: { files: string[] }): Promise<void> {
    return this.page
      .waitForEvent('filechooser')
      .then(x => x.setFiles(options.files));
  }

  @PlaywrightAction()
  async query<T extends DOMElement>(selector: string): Promise<ElementRef<T> | null> {
    try {
      const handle = await this.page.waitForSelector(selector);
      return new PlaywrightElement<T>(handle, this.page, selector);
    } catch (ex) {
      if (ex instanceof playwright.errors.TimeoutError) {
        return null;
      }

      throw ex;
    }
  }

  @PlaywrightAction()
  async queryList<T extends DOMElement>(selector: string): Promise<ElementRefList<T>> {
    // todo: how to wait for $$?
    return (await this.page.$$(selector))
      .map(handle => new PlaywrightElement(handle, this.page, selector));
  }

  @PlaywrightAction()
  async immediateQuery<T extends DOMElement>(selector: string): Promise<ElementRef<T> | null> {
    const handle = await this.page.$(selector);
    if (handle) {
      return new PlaywrightElement<T>(handle, this.page, selector);
    }

    return null;
  }

  @PlaywrightAction()
  async immediateQueryList<T extends DOMElement>(selector: string): Promise<ElementRefList<T>> {
    return (await this.page.$$(selector))
      .map(handle => new PlaywrightElement(handle, this.page, selector));
  }

  @PlaywrightAction()
  evaluate<V extends Data>(action: (arg: V) => void, arg: V): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.page.evaluate<void, V>(reinterpret<any>(action), arg);
  }
}