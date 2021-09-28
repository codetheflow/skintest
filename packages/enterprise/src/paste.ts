import { perform, Query, Task, task } from '@skintest/sdk';
import { CanBrowseTheWeb } from '@skintest/web';

/**
 * paste ext from the clipboard by using fill method
 * 
 * @param query target element selector
 * @returns task
 */
export async function paste(I: CanBrowseTheWeb, query: Query<HTMLInputElement | HTMLAreaElement>): Promise<Task> {
  return task(
    perform(`paste ${query.toString()}`
      // todo: investigate why focus doesn't work?
      , I.focus(query)
      , I.select('text', query)
      , I.press('Control+V')
    )
  );
}