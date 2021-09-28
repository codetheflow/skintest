import { handle, perform, Task, task } from '@skintest/sdk';
import { CanBrowseTheWeb } from 'packages/web/src/abilities/can-browse-the-web';
import { $grid } from '../components/$grid';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_path import file path
 * @returns task
 */
export async function import_data_from(I: CanBrowseTheWeb, file_path: string): Promise<Task> {
  return task(

    perform('click `Import file`'
      , I.click($grid.action('Import file'))
    ),

    handle('open file from the toolbar action'
      , I.wait('file-dialog', file_path)
    ),

  );
}