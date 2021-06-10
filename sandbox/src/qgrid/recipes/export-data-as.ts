import { download, handle, I, perform, recipe, Recipe } from '@skintest/sdk';
import * as path from 'path';
import { grid } from '../components/grid';
import { data } from '../project/data';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_name name of the file
 * @returns recipe
 */
export async function export_data_as(file_name: string): Promise<Recipe> {
  const ext = (
    path
      .extname(file_name)
      .split('.')
      .pop() || ''
  )
    .toUpperCase();

  const file_path = path.join(data.downloads_path, file_name);
  return recipe(
    perform(`click \`Export to ${ext}\` to download`
      , I.click(grid.action(`Export to ${ext}`))
    ),
    handle('download', download.save(file_path)),
  );
}