import { I, perform, Recipe, recipe, wait } from '@skintest/sdk';
import { grid } from '../components/grid';

/**
 * waits for download completed after the click to the grid action
 * 
 * @param file_path import file path
 * @returns recipe
 */
export async function import_data_from(file_path: string): Promise<Recipe> {
  return recipe(
    perform(`click \`Import file\``
      , I.click(grid.action(`Import file`))
    ),
    wait('file-chooser', x => x.open(file_path))
  );
}