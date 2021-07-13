import { qte } from '@skintest/common';
import { download, handle, I, perform, task, Task } from '@skintest/sdk';
import * as path from 'path';
import { $grid } from '../components/$grid';
import { data } from '../project/data';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_name name of the file
 * @returns task
 */
export async function export_data_as(file_name: string): Promise<Task> {
  const ext = (
    path
      .extname(file_name)
      .split('.')
      .pop() || ''
  )
    .toUpperCase();

  const file_path = path.join(data.downloads_path, file_name);
  return task(
    perform(`click ${qte('Export to ${ext}')} to download`
      , I.click($grid.action(`Export to ${ext}`))
    ),
    handle('download', download.save(file_path)),
  );
}