import { I, perform, Query, Recipe, recipe } from '@skintest/sdk';

/**
 * paste ext from the clipboard by using fill method
 * 
 * @param query target element selector
 * @returns recipe
 */
export async function paste_to(query: Query<HTMLElement>): Promise<Recipe> {
  return recipe(
    perform(`paste ${query.toString()}`
      // todo: investigate why focus doesn't work?
      , I.focus(query)
      , I.fill(query, '')
      , I.press('Control+V')
    )
  );
}