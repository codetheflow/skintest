import { fileDialog, handle, I, perform, Task, task } from '@skintest/sdk';
import { $grid } from '../components/$grid';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_path import file path
 * @returns task
 */
export async function import_data_from(file_path: string): Promise<Task> {
  return task(
    perform('click `Import file`'
      , I.click($grid.action(`Import file`))
    ),
    handle('file-dialog', fileDialog.open(file_path))
  );
}