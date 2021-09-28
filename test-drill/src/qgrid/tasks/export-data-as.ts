import { qte } from '@skintest/common';
import { perform, task, Task } from '@skintest/sdk';
import { CanBrowseTheWeb, download } from '@skintest/web';
import * as path from 'path';
import { $grid } from '../components/$grid';
import { assets } from '../project/assets';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_name name of the file
 * @returns task
 */
export async function export_data_as(I: CanBrowseTheWeb, file_name: string): Promise<Task> {
  const ext = (
    path
      .extname(file_name)
      .split('.')
      .pop() || ''
  )
    .toUpperCase();

  const file_path = path.join(assets.downloads_path, file_name);

  return task(

    perform(`click ${qte('Export to ${ext}')} to download`
      , I.click($grid.action(`Export to ${ext}`))
      , I.wait('download', download.save(file_path))
    ),

    wait('download', download.save(file_path)),

  );
}