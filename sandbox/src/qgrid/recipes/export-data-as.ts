import { I, perform, recipe, Recipe, wait } from '@skintest/sdk';
import * as path from 'path';
import { grid } from '../components/grid';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_path export file path
 * @returns recipe
 */
export async function export_data_as(file_path: string): Promise<Recipe> {
  const ext = (
    path
      .extname(file_path)
      .split('.')
      .pop() || ''
  )
    .toUpperCase();

  return recipe(
    perform(`click \`Export to ${ext}\` to download`
      , I.click(grid.action(`Export to ${ext}`))
    ),
    wait('download', x => x.save(path.join(file_path))),
  );
}