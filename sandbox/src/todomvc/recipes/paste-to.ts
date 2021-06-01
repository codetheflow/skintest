import { I, Query, recipe } from '@skintest/sdk';

export const paste_to = recipe.client(
  /**
   * paste ext from the clipboard by using fill method
   * 
   * @param query target element selector
   * @returns paste text client recipe
   */
  function (query: Query<HTMLElement>) {
    const { page } = this;

    return page.do(`I paste ${query.toString()}`
      // todo: investigate why focus doesn't work?
      , I.focus(query)
      , I.fill(query, '')
      , I.press('Control+V')
    );
  }
);