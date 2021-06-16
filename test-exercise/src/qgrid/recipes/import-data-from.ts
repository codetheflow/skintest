import { fileDialog, handle, I, perform, Recipe, recipe } from '@skintest/sdk';
import { grid } from '../components/grid';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_path import file path
 * @returns recipe
 */
export async function import_data_from(file_path: string): Promise<Recipe> {
  return recipe(
    perform('click `Import file`'
      , I.click(grid.action(`Import file`))
    ),
    handle('file-dialog', fileDialog.open(file_path))
  );
}