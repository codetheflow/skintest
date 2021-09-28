import { errors, Guard, NumberDictionary } from '@skintest/common';
import { DOMElement, ElementClassList, ElementRef, ElementState } from '@skintest/web';
import * as pw from 'playwright';

export class PlaywrightElement<T extends DOMElement> implements ElementRef<T> {
  constructor(
    private handle: pw.ElementHandle<DOMElement>,
    private page: pw.Page,
    private selector: string,
  ) {
    Guard.notNull(handle, 'handle');
    Guard.notNull(page, 'page');
    Guard.notEmpty(selector, 'selector');
  }

  async tagName(): Promise<string> {
    const value = await this
      .page
      .$eval<string>(
        this.selector,
        x => x.tagName
      );

    return value;
  }

  async attribute(name: string): Promise<string | null> {
    const value = await this.handle.getAttribute(name);
    return value;
  }

  async style(name: string): Promise<string | null> {
    const value = await this
      .page
      .$eval<string, string, HTMLElement>(
        this.selector,
        (el, name) => window.getComputedStyle(el).getPropertyValue(name),
        name
      );

    return value;
  }

  async state(state: ElementState): Promise<boolean> {
    switch (state) {
      case 'checked': return await this.handle.isChecked();
      case 'disabled': return await this.handle.isDisabled();
      case 'editable': return await this.handle.isEditable();
      case 'enabled': return await this.handle.isEnabled();
      case 'focused': return await this.page.$eval(this.selector, x => x === document.activeElement);
      case 'hidden': return await this.handle.isHidden();
      case 'unchecked': return !(await this.handle.isChecked());
      case 'visible': return await this.handle.isVisible();
      case 'exists': return true;
      default: throw errors.invalidArgument('state', state);
    }
  }

  async text(): Promise<string> {
    const value = await this.value();
    if (value) {
      return value;
    }

    const innerText = await this.handle?.innerText();
    return innerText || '';
  }

  async classList(): Promise<ElementClassList> {
    const classList = await this
      .page
      .$eval<NumberDictionary<string>, HTMLElement>(
        this.selector,
        x => x.classList
      );

    const set = new Set(
      Object
        .keys(classList)
        .map(key => classList[Number(key)])
    );

    return {
      has(name: string) {
        return set.has(name);
      },
      toString() {
        return Array.from(set.values()).join('|');
      }
    };
  }

  private async value(): Promise<string> {
    const value = await this
      .page
      .$eval<string, HTMLInputElement>(
        this.selector,
        x => x.value
      );

    return value;
  }
}